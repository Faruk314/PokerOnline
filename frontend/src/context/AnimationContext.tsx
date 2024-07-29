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
    (playerId: number) => {
      const chipRef = playerPotRefs.find(
        (ref) => ref.current && ref.current.id === playerId.toString()
      );

      if (!chipRef) return;

      console.log(chipRef, "chip ref");

      const chipRect = chipRef.current?.getBoundingClientRect();
      const tablePotRect = tablePotRef.current?.getBoundingClientRect();

      if (!chipRect || !tablePotRect) return;

      const chipElement = createChipElement(chipRect.top, chipRect.left);

      document.body.appendChild(chipElement);

      // Animate the chip movement
      setTimeout(() => {
        chipElement.style.top = `${tablePotRect.top}px`;
        chipElement.style.left = `${tablePotRect.left}px`;

        setTimeout(() => {
          document.body.removeChild(chipElement);
        }, 500);
      }, 100);
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
