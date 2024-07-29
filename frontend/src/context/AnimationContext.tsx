import {
  createContext,
  ReactNode,
  useRef,
  RefObject,
  useState,
  useCallback,
} from "react";
import chip from "../assets/images/chip.png";

const initialAnimationContextData: any = {};

export const AnimationContext = createContext(initialAnimationContextData);

type AnimationContextProviderProps = {
  children: ReactNode;
};

export const AnimationContextProvider = ({
  children,
}: AnimationContextProviderProps) => {
  const tablePotRef = useRef<HTMLImageElement>(null);
  const [playerPotRefs, setPlayerPotRefs] = useState<
    RefObject<HTMLImageElement>[]
  >([]);

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

  const moveChip = useCallback(
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
        } else {
          chipElement.style.top = `${tablePotRect.top}px`;
          chipElement.style.left = `${tablePotRect.left}px`;
        }

        setTimeout(() => {
          document.body.removeChild(chipElement);
        }, 500);
      }, animationDuration);
    },
    [playerPotRefs]
  );

  const contextValue: any = {
    tablePotRef,
    playerPotRefs,
    createPlayerPotRef,
    moveChip,
  };

  return (
    <AnimationContext.Provider value={contextValue}>
      {children}
    </AnimationContext.Provider>
  );
};
