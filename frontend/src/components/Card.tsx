import cardBack from "../assets/images/back.png";
import { useContext } from "react";
import { AnimationContext } from "../context/AnimationContext";

interface Props {
  card: string;
  style: string;
  playerId: string;
  cardIndex: number;
}

const Card = ({ style, playerId, cardIndex }: Props) => {
  const { assignCardRef } = useContext(AnimationContext);

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
