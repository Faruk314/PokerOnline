import { useContext, useRef } from "react";
import person from "../assets/images/person.png";
import classNames from "classnames";
import chip from "../assets/images/chip.png";
import { useAppSelector } from "../store/hooks";
import { IPlayer } from "../types/types";
import { useEffect } from "react";
import Card from "./Card";
import RaiseBar from "./RaiseBar";
import { AnimationContext } from "../context/AnimationContext";
import TimeBar from "./TimeBar";
import Buttons from "./Buttons";
import { GameContext } from "../context/GameContext";
import HandName from "./HandName";

interface Props {
  position: string;
  player: IPlayer;
}

const Player = ({ player, position }: Props) => {
  const { gameState, openRaiseBar } = useAppSelector((state) => state.game);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { playerInfo, coins, isFold, isDealer, cards } = player;
  const { createPlayerPotRef, actionAnimation } = useContext(AnimationContext);
  const { findPotSpliter } = useContext(GameContext);
  const potRef = useRef<HTMLImageElement>(null);
  const isCurrentPlayer =
    loggedUserInfo?.userId === gameState?.playerTurn.playerInfo.userId &&
    loggedUserInfo?.userId === player.playerInfo.userId;

  useEffect(() => {
    createPlayerPotRef(potRef);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <HandName hand={gameState.winner.hand} />
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

          <div className="flex items-center space-x-1">
            <span>pot: {player.playerPot}</span>
            <img
              id={playerInfo.userId.toString()}
              src={chip}
              className="relative chip w-[0.8rem] chip h-[0.8rem]"
            />
          </div>

          {gameState?.playerTurn.playerInfo.userId ===
            player.playerInfo.userId &&
            gameState.playerTurn.time && (
              <TimeBar time={gameState.playerTurn.time} />
            )}

          {isDealer && (
            <div className="absolute top-[-0.5rem] right-[-0.5rem] z-20 bg-yellow-600 text-white rounded-full w-7 h-7 flex items-center justify-center border-2">
              D
            </div>
          )}
        </div>
      </div>

      {isCurrentPlayer && (
        <div className="fixed text-white font-bold text-2xl flex space-x-4 right-10 bottom-10">
          {!openRaiseBar && <Buttons />}

          {openRaiseBar && <RaiseBar />}
        </div>
      )}
    </div>
  );
};
export default Player;
