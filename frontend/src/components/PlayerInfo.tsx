import person from "../assets/images/person.png";
import classNames from "classnames";
import chip from "../assets/images/chip.png";
import { useAppSelector } from "../store/hooks";
import { IPlayer, Hand } from "../types/types";
import { useEffect, useState } from "react";
import Card from "./Card";

interface Props {
  position: string;
  player: IPlayer;
}

const PlayerInfo = ({ position, player }: Props) => {
  const { gameState } = useAppSelector((state) => state.game);
  const {
    playerInfo,
    coins,
    isFold,
    playerPot,
    playerRaise,
    isDealer,
    cards,
    isCall,
  } = player;
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const [timeOut, setTimeOut] = useState({ state: "", status: false });

  const isLoggedUser = loggedUserInfo?.userId === player.playerInfo.userId;

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (playerRaise.isRaise) {
      setTimeOut({ state: "raise", status: true });
    }

    if (isCall) {
      setTimeOut({ state: "call", status: true });
      console.log("isCall", true);
    }

    if (isFold) {
      setTimeOut({ state: "fold", status: true });
    }

    if (isFold || playerRaise.isRaise || isCall) {
      timeoutId = setTimeout(() => {
        setTimeOut({ state: "", status: false });
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isFold, playerRaise.isRaise, isCall]);

  const getRank = (rank: number) => {
    if (rank === 11) {
      return "J";
    }

    if (rank === 12) {
      return "Q";
    }

    if (rank === 13) {
      return "K";
    }

    if (rank === 14) {
      return "A";
    }

    return rank.toString();
  };

  const findHandName = (hand: Hand) => {
    if (!hand) return;

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

  const findPotSpliter = (playerId: number) => {
    const potSpliter = gameState?.draw.potSpliters.find(
      (p) => p.userId === playerId
    );

    if (!potSpliter) return null;

    return (
      <div className="absolute flex items-center flex-col top-[-4rem] text-yellow-400 text-4xl font-bold">
        <span>DRAW</span>
        {findHandName(potSpliter.hand)}
      </div>
    );
  };

  return (
    <div
      className={classNames(
        "absolute flex z-[30] space-x-2 items-center text-white font-bold",
        {
          "top-[10rem] left-[-5rem]": position === "left",
          "top-[-5rem] right-[27rem]": position === "topCenter",
          "bottom-[-3rem] right-[27rem]": position === "bottomCenter",
          "top-[10rem] right-[-5rem]": position === "right",
          "top-[-5rem] left-[5rem]": position === "topLeft",
          "top-[-5rem] right-[5rem]": position === "topRight",
          "bottom-[-3rem] left-[5rem]": position === "bottomLeft",
          "bottom-[-3rem] right-[5rem]": position === "bottomRight",
        }
      )}
    >
      <div className="relative h-[7rem] w-[7rem] flex flex-col items-center">
        {playerPot > 0 && (
          <div className="absolute top-[-2rem] text-white font-bold flex items-center space-x-2 bg-[rgba(0,0,0,0.5)] py-[0.1rem] rounded-full px-1">
            <img src={chip} className="w-5 h-5" />
            <span>{playerPot}</span>
          </div>
        )}

        {gameState?.winner &&
          gameState?.winner.userId === player.playerInfo?.userId && (
            <div className="absolute flex items-center flex-col top-[-4rem] text-yellow-400 text-4xl font-bold">
              <span>WINNER</span>
              {findHandName(gameState.winner.hand)}
            </div>
          )}

        {gameState?.draw.isDraw && findPotSpliter(player.playerInfo.userId)}

        <img src={person} className="rounded-full" />

        {!isFold && (
          <div className="absolute bottom-0 flex">
            <Card
              isLoggedUser={isLoggedUser}
              card={cards[0]}
              style="cardContainer rotate-[-5deg] left-3 rounded-sm"
            />

            <Card
              isLoggedUser={isLoggedUser}
              card={cards[1]}
              style={"cardContainer rotate-[5deg] relative right-3"}
            />
          </div>
        )}

        {timeOut.status && (
          <div className="absolute z-20 top-[25%]">
            <div
              className={classNames(
                "bg-[rgba(0,0,0,0.8)] font-bold button-border border-white rounded-md p-1 px-4 text-white highlight",
                {
                  "border-green-600": timeOut.state === "raise",
                  "border-red-600": timeOut.state === "fold",
                  "border-blue-600": timeOut.state === "call",
                }
              )}
            >
              <span>{timeOut.state}</span>
            </div>
          </div>
        )}

        <div
          className={classNames(
            "flex flex-col justify-center z-[20] w-[8rem] rounded-md relative top-[-1rem] items-center shadow-md bg-gray-900",
            {
              highlight:
                gameState?.playerTurn?.playerInfo.userId === playerInfo.userId,
            }
          )}
        >
          <div className="border-b border-gray-700 py-1 w-full text-center">
            {playerInfo?.userName}
          </div>
          <div className="flex items-center py-1 space-x-2">
            <img src={chip} className="w-[1.2rem] h-[1.2rem]" />
            <span>{coins}</span>
          </div>

          {isDealer && (
            <div className="absolute top-[-0.5rem] right-[-0.5rem] z-20 bg-yellow-600 text-white rounded-full w-7 h-7 flex items-center justify-center border-2">
              D
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerInfo;
