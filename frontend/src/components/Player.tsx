import { useContext, useRef } from "react";
import person from "../assets/images/person.png";
import classNames from "classnames";
import chip from "../assets/images/chip.png";
import { useAppSelector } from "../store/hooks";
import { IPlayer, Hand } from "../types/types";
import { useEffect, useState } from "react";
import Card from "./Card";
import { SocketContext } from "../context/SocketContext";
import { useParams } from "react-router-dom";
import RaiseBar from "./RaiseBar";
import { AnimationContext } from "../context/AnimationContext";

interface Props {
  position: string;
  player: IPlayer;
}

const Player = ({ player, position }: Props) => {
  const { gameState } = useAppSelector((state) => state.game);
  const { playerInfo, coins, isFold, isDealer, cards } = player;
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const [openRaiseBar, setOpenRaiseBar] = useState(false);
  const { socket } = useContext(SocketContext);
  const { id } = useParams<{ id: string }>();
  const { createPlayerPotRef, actionAnimation } = useContext(AnimationContext);
  const potRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    createPlayerPotRef(potRef);
  }, []);

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

  const renderButtons = () => {
    const playerTurn = gameState?.playerTurn;
    const callAmount = gameState!.lastBet - playerTurn!.playerPot;

    const canCheck = callAmount <= 0;
    const allIn = gameState?.players.some((player) => player.coins === 0);

    return (
      <>
        <button
          onClick={handleFold}
          className="button-border bg-gray-900 px-8 py-2 bg-red-700 hover:bg-red-600 rounded-full"
        >
          FOLD
        </button>
        {!canCheck && (
          <button
            onClick={() => handleCall(callAmount!)}
            className="button-border flex space-x-3 items-center bg-gray-900 px-8 py-2 hover:bg-gray-800 rounded-full"
          >
            <span>CALL</span>
            <div className="flex items-center space-x-1">
              <span>{callAmount}</span>
              <img src={chip} className="w-4 h-4" />
            </div>
          </button>
        )}

        {canCheck && (
          <button
            onClick={handleCheck}
            className="button-border flex space-x-3 items-center bg-gray-900 px-8 py-2 hover:bg-gray-800 rounded-full"
          >
            <span>CHECK</span>
          </button>
        )}

        {!allIn && (
          <button
            onClick={() => setOpenRaiseBar(true)}
            className="button-border bg-gray-900 px-8 py-2 bg-green-700 hover:bg-green-600 rounded-full"
          >
            RAISE
          </button>
        )}
      </>
    );
  };

  const handleCall = (amount: number) => {
    socket?.emit("playerCall", { roomId: id, amount });
  };

  const handleCheck = () => {
    socket?.emit("playerCheck", { roomId: id });
  };

  const handleFold = () => {
    socket?.emit("playerFold", { roomId: id });
  };

  const handleRaise = (amount: number) => {
    socket?.emit("playerRaise", { roomId: id, amount });
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
              playerId={playerInfo.userId}
              card={cards[0]}
              style="cardContainer rotate-[-5deg] left-3 rounded-sm"
              cardIndex={0}
            />

            <Card
              playerId={playerInfo.userId}
              card={cards[1]}
              style={"cardContainer rotate-[5deg] relative right-3"}
              cardIndex={1}
            />
          </div>
        )}

        {actionAnimation.playerId === playerInfo.userId && (
          <div className="absolute z-20 top-[25%]">
            <div
              className={classNames(
                "bg-[rgba(0,0,0,0.8)] border-2 font-bold rounded-md p-1 px-5 text-white highlight",
                {
                  "border-green-600": actionAnimation.state === "raise",
                  "border-red-600": actionAnimation.state === "fold",
                  "border-blue-400": actionAnimation.state === "call",
                  "border-yellow-400": actionAnimation.state === "check",
                }
              )}
            >
              <span>{actionAnimation.state}</span>
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
            <img
              id={playerInfo.userId.toString()}
              ref={potRef}
              src={chip}
              className="relative chip w-[1.2rem] chip h-[1.2rem]"
            />
            <span>{coins}</span>
          </div>

          {isDealer && (
            <div className="absolute top-[-0.5rem] right-[-0.5rem] z-20 bg-yellow-600 text-white rounded-full w-7 h-7 flex items-center justify-center border-2">
              D
            </div>
          )}
        </div>
      </div>

      {loggedUserInfo?.userId === gameState?.playerTurn.playerInfo.userId &&
        loggedUserInfo?.userId === player.playerInfo.userId && (
          <div className="fixed text-white font-bold text-2xl flex space-x-4 right-10 bottom-10">
            {!openRaiseBar && renderButtons()}

            {openRaiseBar && (
              <RaiseBar
                setOpenRaiseBar={setOpenRaiseBar}
                handleRaise={handleRaise}
                maxAmount={gameState?.playerTurn.coins}
                minAmout={gameState!.lastBet > 0 ? gameState?.lastBet : 1}
              />
            )}
          </div>
        )}
    </div>
  );
};
export default Player;
