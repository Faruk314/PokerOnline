import {
  createContext,
  ReactNode,
  useRef,
  useState,
  useCallback,
  useContext,
} from "react";
import {
  IActionAnimation,
  IPlayer,
  TCardRefsMap,
  ChipMoveDirection,
} from "../types/types";
import pokerCards from "../utils/cards";
import { AudioContext } from "./AudioContext";
import cardFlip from "../assets/audio/cardFlip.mp3";
import cardDeal from "../assets/audio/dealCard.wav";
import { useAppSelector } from "../store/hooks";

const initialAnimationContextData: any = {};

export const AnimationContext = createContext(initialAnimationContextData);

type AnimationContextProviderProps = {
  children: ReactNode;
};

export const AnimationContextProvider = ({
  children,
}: AnimationContextProviderProps) => {
  const { playAudio } = useContext(AudioContext);
  const tablePotRef = useRef<HTMLDivElement | null>(null);
  const [animationMap, setAnimationMap] = useState(
    new Map<string, IActionAnimation>()
  );
  const gameState = useAppSelector((state) => state.game.gameState);
  const [animateFlop, setAnimateFlop] = useState(false);
  const frozenTablePotRef = useRef<number | null>(gameState?.totalPot || 0);
  const playerPotRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const playerSeatRefs = useRef<Map<number, HTMLElement>>(new Map());
  const tablePotRefs = useRef<Map<string, HTMLElement>>(new Map());
  const cardRefsMap: TCardRefsMap = useRef(new Map<string, HTMLElement[]>());

  const assignCardRef =
    (playerId: string, index: number) => (el: HTMLElement | null) => {
      if (el) {
        const refs = cardRefsMap.current.get(playerId) || [];
        refs[index] = el;
        cardRefsMap.current.set(playerId, refs);
      }
    };

  const registerPlayerPot = useCallback(
    (playerId: number, el: HTMLDivElement | null) => {
      if (!el) {
        playerPotRefs.current.delete(playerId);
      } else {
        playerPotRefs.current.set(playerId, el);
      }
    },
    []
  );

  const registerPlayerSeat = useCallback(
    (playerId: number, el: HTMLDivElement | null) => {
      if (!el) {
        playerSeatRefs.current.delete(playerId);
      } else {
        playerSeatRefs.current.set(playerId, el);
      }
    },
    []
  );

  const registerTablePotRefs = useCallback(
    (potId: string, el: HTMLDivElement | null) => {
      if (!el) {
        tablePotRefs.current.delete(potId);
      } else {
        tablePotRefs.current.set(potId, el);
      }
    },
    []
  );

  const animateMoveChip = useCallback(
    (
      playerId: number,
      direction: ChipMoveDirection = "playerToTable",
      potId: string = "totalPot"
    ) => {
      const playerPotEl = playerPotRefs.current.get(playerId);
      const playerSeatEl = playerSeatRefs.current.get(playerId);
      const tableEl =
        potId === "totalPot"
          ? tablePotRef.current
          : tablePotRefs.current.get(potId);

      if (!tableEl) return;

      const isTableToPlayer = direction === "tableToPlayer";

      const fromEl = isTableToPlayer ? tableEl : playerPotEl;
      const toEl = isTableToPlayer ? playerSeatEl : tableEl;

      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const originalVisibility = fromEl.style.visibility;
      fromEl.style.visibility = "hidden";

      const chip = document.createElement("div");
      chip.style.position = "fixed";
      chip.style.left = `${fromRect.left}px`;
      chip.style.top = `${fromRect.top}px`;
      chip.style.width = `${fromRect.width}px`;
      chip.style.height = `${fromRect.height}px`;
      chip.style.pointerEvents = "none";
      chip.style.zIndex = "9999";

      chip.style.transform = "translate(0px, 0px) scale(1)";
      chip.style.opacity = "1";

      chip.style.transition =
        "transform 600ms cubic-bezier(.22,.61,.36,1), opacity 300ms";

      chip.innerHTML = fromEl.innerHTML;
      document.body.appendChild(chip);

      chip.getBoundingClientRect();

      const dx =
        toRect.left + toRect.width / 2 - (fromRect.left + fromRect.width / 2);

      const dy =
        toRect.top + toRect.height / 2 - (fromRect.top + fromRect.height / 2);

      requestAnimationFrame(() => {
        chip.style.transform = `translate(${dx}px, ${dy}px) scale(0.9)`;
        chip.style.opacity = "0.85";
      });

      setTimeout(() => {
        chip.remove();

        if (fromEl.isConnected && direction === "playerToTable") {
          fromEl.style.visibility = originalVisibility;
        }

        if (toEl.isConnected && direction === "playerToTable") {
          toEl.style.visibility = "visible";
        }
      }, 600);
    },
    []
  );

  const animateCardFlip = (player: IPlayer) => {
    const cardRefs = cardRefsMap.current.get(player.playerInfo.userId);

    cardRefs?.forEach((cardRef, index) => {
      const cardFront = cardRef.lastElementChild as HTMLImageElement;

      if (!cardRef) return;

      if (!cardRef.firstElementChild) return;

      const foundCard = pokerCards.find((c) => c.card === player?.cards[index]);

      cardRef.style.transition = "transform 500ms ease";
      let duration = 500;

      if (index === 1) {
        cardRef.style.transition = "transform 400ms ease";
        duration = 400;
      }

      if (!foundCard?.image) return;

      cardFront.src = foundCard?.image;

      setTimeout(() => {
        cardRef.classList.add("flip");
        playAudio(cardFlip);
      }, duration);
    });
  };

  const animateCard = (playerId: string) => {
    const cardRefs = cardRefsMap.current.get(playerId);
    if (!cardRefs) return;

    cardRefs.forEach((cardRef, cardIndex) => {
      if (cardRef) {
        if (!tablePotRef.current) return;

        cardRef.style.transition = "none";
        cardRef.classList.remove("flip");

        const tablePotRect = tablePotRef.current.getBoundingClientRect();
        const cardRect = cardRef.getBoundingClientRect();

        const cardTop = tablePotRect.top - cardRect.top + cardRef.offsetTop;
        const cardLeft = tablePotRect.left - cardRect.left + cardRef.offsetLeft;

        setTimeout(() => {
          cardRef.style.top = `${cardTop}px`;
          cardRef.style.left = `${cardLeft}px`;
        }, 0);

        let duration = 600;

        if (cardIndex === 1) duration = 500;

        setTimeout(() => {
          cardRef.style.top = "0px";
          cardRef.style.transition = "top 0.6s ease, left 0.6s ease";

          if (cardIndex === 1)
            cardRef.style.transition = "top 0.5s ease, left 0.5s ease";

          cardRef.style.left = "0px";

          playAudio(cardDeal);
        }, duration);
      }
    });
  };

  const contextValue: any = {
    tablePotRef,
    playerPotRefs,
    frozenTablePotRef,
    animateFlop,
    animationMap,
    setAnimationMap,
    registerPlayerPot,
    registerPlayerSeat,
    registerTablePotRefs,
    animateMoveChip,
    animateCard,
    animateCardFlip,
    setAnimateFlop,
    assignCardRef,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};
