import cardBack from "../assets/images/back.png";
import { useContext } from "react";
import { AnimationContext } from "../context/AnimationContext";

interface Props {
  card: string;
  style: string;
  playerId: number;
  cardIndex: number;
}

const Card = ({ card, style, playerId, cardIndex }: Props) => {
  const { assignCardRef } = useContext(AnimationContext);

  // useEffect(() => {
  //   if (isLoggedUser && gameState?.currentRound === "preFlop") {
  //     const pokerCard = pokerCards.find((c) => c.card === card);

  //     if (!pokerCard) return;

  //     if (!cardFrontRef.current || !cardRef.current || !cardBackRef.current)
  //       return;

  //     cardFrontRef.current!.src = pokerCard.image;

  //     setTimeout(() => {
  //       cardRef.current!.classList.add("flip");
  //     }, 1000);
  //   }

  //   if (gameState?.currentRound === "showdown") {
  //     setTimeout(() => {
  //       cardRef.current!.classList.remove("flip");
  //     }, 3000);

  //     const pokerCard = pokerCards.find((c) => c.card === card);

  //     if (!pokerCard) return;

  //     if (!cardFrontRef.current || !cardRef.current || !cardBackRef.current)
  //       return;

  //     cardFrontRef.current!.src = pokerCard.image;

  //     cardRef.current!.classList.add("flip");
  //   }
  // }, [card, isLoggedUser, gameState?.currentRound]);

  return (
    <div className={style}>
      <div ref={assignCardRef(playerId, cardIndex)} className="card">
        <img src={cardBack} className="card-back" />
        <img className="card-front bg-white" />
      </div>
    </div>
  );
};

export default Card;
