import { useContext } from "react";
import { Hand } from "../types/types";
import { GameContext } from "../context/GameContext";

interface Props {
  hand: Hand;
}

const HandName = ({ hand }: Props) => {
  const { getRank } = useContext(GameContext);

  if (!hand) return null;

  let rank: string = "";
  let rankTwo: string = "";

  if (hand.rank) {
    rank = getRank(hand.rank);
  }

  if (hand.rankTwo) {
    rankTwo = getRank(hand.rankTwo);
  }

  if (hand.name === "twoPair") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>
          Two pair {rank} and {rankTwo}
        </span>
      </div>
    );
  }

  if (hand.name === "highCard") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>High Card, {rank}</span>
      </div>
    );
  }

  if (hand.name === "onePair") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Pair of {rank}</span>
      </div>
    );
  }

  if (hand.name === "straight") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Straight</span>
        <span>{rank} high</span>
      </div>
    );
  }

  if (hand.name === "straightFlush") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Straight flush</span>
        <span>{rank} high</span>
      </div>
    );
  }

  if (hand.name === "flush") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Flush</span>
        <span>{rank} high</span>
      </div>
    );
  }

  if (hand.name === "royalFlush") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Royal Flush</span>
      </div>
    );
  }

  if (hand.name === "3Kind") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Three of a Kind, {rank}</span>
      </div>
    );
  }

  if (hand.name === "4Kind") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>Four of a Kind, {rank}</span>
      </div>
    );
  }

  if (hand.name === "fullHouse") {
    return (
      <div className="text-xl flex space-x-2 text-white font-bold whitespace-nowrap">
        <span>
          Full House {rank} Full of {rankTwo}
        </span>
      </div>
    );
  }
};

export default HandName;
