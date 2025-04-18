import cardBack from "../assets/images/back.png";
import { useContext } from "react";
import { AnimationContext } from "../context/AnimationContext";
import pokerCards from "../utils/cards";
import classNames from "classnames";

interface Props {
  card: string;
  style: string;
  playerId: string;
  cardIndex: number;
}

const Card = ({ style, playerId, cardIndex, card }: Props) => {
  const { assignCardRef } = useContext(AnimationContext);

  const frontImage = card
    ? pokerCards.find((c) => c.card === card)?.image
    : undefined;

  return (
    <div className={style}>
      <div
        ref={assignCardRef(playerId, cardIndex)}
        className={classNames("card", {
          "transform transition-transform ease flip": frontImage,
          "duration-[400ms]": frontImage && cardIndex === 1,
          "duration-[500ms]": frontImage && cardIndex === 0,
        })}
      >
        <img src={cardBack} className="card-back bg-white" />
        <img
          src={frontImage}
          className="card-front bg-white border border-black"
        />
      </div>
    </div>
  );
};

export default Card;
