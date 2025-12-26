import { useContext, useRef } from "react";
import person from "../assets/images/person.png";
import classNames from "classnames";
import chip from "../assets/images/chip.png";
import { useAppSelector } from "../store/hooks";
import { IPlayer } from "../types/types";
import Card from "./Card";
import { AnimationContext } from "../context/AnimationContext";
import TimeBar from "./TimeBar";
import { GameContext } from "../context/GameContext";
import HandName from "./HandName";
import ChipStack from "./ChipStack";

interface Props {
  position: string;
  player: IPlayer;
}

const Player = ({ player, position }: Props) => {
  const { gameState } = useAppSelector((state) => state.game);
  const { playerInfo, coins, isFold, isDealer, cards } = player;
  const { registerPlayerPot, registerPlayerSeat, animationMap } =
    useContext(AnimationContext);
  const { findPotSpliter } = useContext(GameContext);
  const potRef = useRef<HTMLImageElement>(null);

  const actionAnimationState = animationMap.get(playerInfo.userId)?.state;

  return (
    <div
      ref={(el) => registerPlayerSeat(player.playerInfo.userId, el)}
      className={classNames(
        "absolute flex z-[30] space-x-2 items-center text-white font-bold",
        {
          "position-left": position === "left",
          "position-topCenter": position === "topCenter",
          "position-bottomCenter": position === "bottomCenter",
          "position-right": position === "right",
          "position-topLeft": position === "topLeft",
          "position-topRight": position === "topRight",
          "position-bottomLeft": position === "bottomLeft",
          "position-bottomRight": position === "bottomRight",
        }
      )}
    >
      <div className="player-image text-[0.8rem] xl:text-[1.2rem] relative flex flex-col items-center">
        {gameState?.potInfo["mainPot"]?.winner &&
          gameState?.potInfo["mainPot"].winner.userId ===
            player.playerInfo?.userId && (
            <div className="absolute flex items-center flex-col top-[-3rem] lg:top-[-4rem] text-yellow-400 text-2xl lg:text-4xl font-bold z-40">
              <span>WINNER</span>
              <HandName hand={gameState.potInfo["mainPot"].winner.hand!} />
            </div>
          )}

        {gameState?.potInfo["mainPot"]?.isDraw &&
          findPotSpliter(player.playerInfo.userId)}

        <img src={person} className="rounded-full" />

        {player.playerPot > 0 && (
          <div
            ref={(el) => registerPlayerPot(player.playerInfo.userId, el)}
            className={classNames("absolute", {
              "left-[5px] top-[-70px]": position === "bottomCenter",
              "left-[100px] top-[-70px]": position === "bottomLeft",
              "right-[100px] top-[-70px]": position === "bottomRight",
              "top-[35px] right-[-70px] translate-x-1/2": position === "left",
              "left-[100px] bottom-[-140px]": position === "topLeft",
              "left-[5px] bottom-[-140px]": position === "topCenter",
              "right-[100px] bottom-[-140px]": position === "topRight",
            })}
          >
            <ChipStack pot={player.playerPot} />
          </div>
        )}

        {!isFold && (
          <div className="absolute bottom-2 xl:bottom-0 flex">
            <Card
              playerId={playerInfo.userId}
              card={cards[0]}
              style="card-container rotate-[-5deg] left-3 rounded-sm"
              cardIndex={0}
            />

            <Card
              playerId={playerInfo.userId}
              card={cards[1]}
              style={"card-container rotate-[5deg] relative right-3"}
              cardIndex={1}
            />
          </div>
        )}

        {actionAnimationState && (
          <div className="absolute z-20 top-[25%]">
            <div
              className={classNames(
                "bg-[rgba(0,0,0,0.8)] border-2 font-bold rounded-md px-4 xl:py-1 lg:px-5 text-white highlight",
                {
                  "border-green-600": actionAnimationState === "raise",
                  "border-red-600": actionAnimationState === "fold",
                  "border-blue-400": actionAnimationState === "call",
                  "border-yellow-400": actionAnimationState === "check",
                }
              )}
            >
              <span>{actionAnimationState}</span>
            </div>
          </div>
        )}

        <div
          className={classNames(
            "player-container flex flex-col justify-center z-[20] rounded-md relative top-[-1rem] items-center shadow-md bg-gray-900",
            {
              highlight:
                gameState?.playerTurn?.playerInfo.userId === playerInfo.userId,
            }
          )}
        >
          <div className="border-b border-gray-700  2xl:py-1 w-full text-center">
            {playerInfo?.userName}
          </div>

          <div className="flex items-center 2xl:py-1 space-x-2">
            <img
              id={playerInfo.userId.toString()}
              ref={potRef}
              src={chip}
              className="relative chip"
            />
            <span>{coins}</span>
          </div>

          {gameState?.playerTurn?.playerInfo.userId ===
            player.playerInfo.userId &&
            gameState.playerTurn.time && (
              <TimeBar time={gameState.playerTurn.time} />
            )}

          {isDealer && (
            <div className="dealer-badge">
              <span>D</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Player;
