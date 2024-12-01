import {
  createContext,
  ReactNode,
  useRef,
  RefObject,
  useState,
  useCallback,
  useContext,
} from "react";
import chip from "../assets/images/chip.png";
import { IActionAnimation, IPlayer, TCardRefsMap } from "../types/types";
import pokerCards from "../utils/cards";
import { AudioContext } from "./AudioContext";
import chipMove from "../assets/audio/chipMove.mp3";
import cardFlip from "../assets/audio/cardFlip.mp3";
import cardDeal from "../assets/audio/dealCard.wav";

const initialAnimationContextData: any = {};

export const AnimationContext = createContext(initialAnimationContextData);

type AnimationContextProviderProps = {
  children: ReactNode;
};

export const AnimationContextProvider = ({
  children,
}: AnimationContextProviderProps) => {
  const { playAudio } = useContext(AudioContext);
  const tablePotRef = useRef<HTMLImageElement>(null);
  const [actionAnimation, setActionAnimation] = useState<IActionAnimation>({
    state: null,
    playerId: null,
  });
  const [animateFlop, setAnimateFlop] = useState(false);
  const [playerPotRefs, setPlayerPotRefs] = useState<
    RefObject<HTMLImageElement>[]
  >([]);
  const cardRefsMap: TCardRefsMap = useRef(new Map<number, HTMLElement[]>());

  const assignCardRef =
    (playerId: number, index: number) => (el: HTMLElement | null) => {
      if (el) {
        const refs = cardRefsMap.current.get(playerId) || [];
        refs[index] = el;
        cardRefsMap.current.set(playerId, refs);
      }
    };

  const createPlayerPotRef = useCallback(
    (ref: RefObject<HTMLImageElement>) => {
      const hasRef = playerPotRefs.some(
        (item) =>
          item.current && ref.current && item.current.id === ref.current.id
      );

      const refs = playerPotRefs;

      refs.push(ref);

      if (!hasRef) setPlayerPotRefs(playerPotRefs);
    },
    [playerPotRefs]
  );

  const createChipElement = (topPos: number, leftPos: number) => {
    const chipElement = document.createElement("img");

    chipElement.src = chip;
    chipElement.style.position = "absolute";
    chipElement.style.zIndex = "300";
    chipElement.style.width = "1.2rem";
    chipElement.style.height = "1.2rem";
    chipElement.style.top = `${topPos}px`;
    chipElement.style.left = `${leftPos}px`;
    chipElement.style.transition = "top 0.5s, left 0.5s";

    return chipElement;
  };

  const animateMoveChip = useCallback(
    (playerId: number, winner = false) => {
      const chipRef = playerPotRefs.find(
        (ref) => ref.current && ref.current.id === playerId.toString()
      );

      if (!chipRef) return;

      const playerPotRect = chipRef.current?.getBoundingClientRect();
      const tablePotRect = tablePotRef.current?.getBoundingClientRect();

      if (!playerPotRect || !tablePotRect) return;

      let chipElement = null;
      let animationDuration = 100;

      if (winner) {
        chipElement = createChipElement(tablePotRect.top, tablePotRect.left);

        document.body.appendChild(chipElement);

        animationDuration = 1000;
      } else {
        chipElement = createChipElement(playerPotRect.top, playerPotRect.left);

        document.body.appendChild(chipElement);
      }

      // Animate the chip movement
      setTimeout(() => {
        if (winner) {
          chipElement.style.top = `${playerPotRect.top}px`;
          chipElement.style.left = `${playerPotRect.left}px`;
          playAudio(chipMove);
        } else {
          chipElement.style.top = `${tablePotRect.top}px`;
          chipElement.style.left = `${tablePotRect.left}px`;
          playAudio(chipMove);
        }

        setTimeout(() => {
          document.body.removeChild(chipElement);
        }, 500);
      }, animationDuration);
    },
    [playerPotRefs, playAudio]
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

  const animateCard = (playerId: number) => {
    const cardRefs = cardRefsMap.current.get(playerId);
    if (cardRefs) {
      cardRefs.forEach((cardRef, cardIndex) => {
        if (cardRef) {
          if (!tablePotRef.current) return;

          cardRef.style.transition = "none";
          cardRef.classList.remove("flip");

          const tablePotRect = tablePotRef.current.getBoundingClientRect();
          const cardRect = cardRef.getBoundingClientRect();

          const cardTop = tablePotRect.top - cardRect.top + cardRef.offsetTop;
          const cardLeft =
            tablePotRect.left - cardRect.left + cardRef.offsetLeft;

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
    }
  };

  const contextValue: any = {
    tablePotRef,
    playerPotRefs,
    animateFlop,
    actionAnimation,
    createPlayerPotRef,
    animateMoveChip,
    animateCard,
    animateCardFlip,
    setAnimateFlop,
    setActionAnimation,
    assignCardRef,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};
