import pokerCards from "../utils/cards";
import cardBack from "../assets/images/back.png";
import { useEffect, useRef } from "react";
import { useAppSelector } from "../store/hooks";

interface Props {
  isLoggedUser: boolean;
  card: string;
  style: string;
}

const Card = ({ isLoggedUser, card, style }: Props) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const cardFrontRef = useRef<HTMLImageElement>(null);
  const cardBackRef = useRef<HTMLImageElement>(null);
  const { gameState } = useAppSelector((state) => state.game);

  useEffect(() => {
    if (isLoggedUser && gameState?.currentRound === "preFlop") {
      const pokerCard = pokerCards.find((c) => c.card === card);

      if (!pokerCard) return;

      if (!cardFrontRef.current || !cardRef.current || !cardBackRef.current)
        return;

      cardFrontRef.current!.src = pokerCard.image;

      setTimeout(() => {
        cardRef.current!.classList.add("flip");
      }, 1000);
    }

    if (gameState?.currentRound === "showdown") {
      setTimeout(() => {
        cardRef.current!.classList.remove("flip");
      }, 3000);

      const pokerCard = pokerCards.find((c) => c.card === card);

      if (!pokerCard) return;

      if (!cardFrontRef.current || !cardRef.current || !cardBackRef.current)
        return;

      cardFrontRef.current!.src = pokerCard.image;

      cardRef.current!.classList.add("flip");
    }
  }, [card, isLoggedUser, gameState?.currentRound]);

  return (
    <div className={style}>
      <div ref={cardRef} className="card">
        <img ref={cardBackRef} src={cardBack} className="card-back" />
        <img
          ref={cardFrontRef}
          src={cardBack}
          className="card-front bg-white"
        />
      </div>
    </div>
  );
};

export default Card;
