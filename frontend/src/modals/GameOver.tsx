import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setGameStatus } from "../store/slices/game";

const GameOver = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const reason = useAppSelector((state) => state.game.gameStatus.reason);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    const gameStatus = {
      isGameOver: false,
      reason: null,
    };

    dispatch(setGameStatus(gameStatus));
  };

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-30 flex flex-col items-center justify-center text-center bg-[rgb(0,0,0,0.2)]">
      <div
        ref={modalRef}
        className="text-white font-bold relative z-40 w-[30rem] p-6 mx-2 space-y-4 bg-gray-800 rounded-md button-border"
      >
        <p className="text-2xl">Game over</p>
        <p>
          {reason === "insufficientFunds" &&
            "Game ended do to insufficient funds"}
          {reason === "opponentInsufficientFunds" &&
            "Game ended do to opponent insufficient funds"}
          {reason === "opponentLeft" && "All players left"}
        </p>

        <button
          onClick={handleClick}
          className="button-border p-2 w-[7rem] bg-green-700 hover:bg-green-600 rounded-full"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default GameOver;
