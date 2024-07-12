import person from "../assets/images/person.png";
import classNames from "classnames";
import chip from "../assets/images/chip.png";
import cardBack from "../assets/images/back.png";
import { useAppSelector } from "../store/hooks";
import { IPlayer } from "../types/types";
import { useEffect, useState } from "react";
import { pokerCards } from "../utils/cards";

interface Props {
  position: string;
  player: IPlayer;
}

const PlayerInfo = ({ position, player }: Props) => {
  const { gameState } = useAppSelector((state) => state.game);
  const { playerInfo, coins, isFold, playerPot, playerRaise, isDealer, cards } =
    player;
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const [timeOut, setTimeOut] = useState({ state: "", status: true });

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    if (playerRaise.isRaise) {
      setTimeOut({ state: "raise", status: true });
    }

    if (isFold) {
      setTimeOut({ state: "fold", status: true });
    }

    if (isFold || playerRaise.isRaise) {
      timeoutId = setTimeout(() => {
        setTimeOut({ state: "", status: false });
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isFold, playerRaise.isRaise]);

  const determineCardSide = (card: string) => {
    if (
      loggedUserInfo?.userId === player.playerInfo.userId ||
      gameState?.currentRound === "showdown"
    ) {
      const pokerCard = pokerCards.find((c) => c.card === card);
      return pokerCard?.image;
    } else {
      return cardBack;
    }
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
        <img src={person} className="rounded-full" />

        {!isFold && (
          <div className="absolute bottom-0 flex">
            <img
              src={determineCardSide(cards[0])}
              className="w-[5rem] h-[6rem] bg-white rounded-sm z-0 rotate-[-5deg]"
            />
            <img
              src={determineCardSide(cards[1])}
              className="w-[5rem] h-[6rem] bg-white rounded-md rotate-[5deg] z-10 relative right-5 border-l border-gray-400 shadow-md"
            />
          </div>
        )}

        {timeOut.state && (
          <div className="absolute z-20 top-[25%]">
            <div
              className={classNames(
                "bg-[rgba(0,0,0,0.8)] font-bold button-border border-white rounded-md p-1 px-4 text-white highlight",
                {
                  "border-green-600": timeOut.state === "raise",
                  "border-red-600": timeOut.state === "fold",
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
