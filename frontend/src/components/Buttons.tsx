import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AudioContext } from "../context/AudioContext";
import clickSound from "../assets/audio/click.wav";
import { GameContext } from "../context/GameContext";
import { useParams } from "react-router-dom";
import chip from "../assets/images/chip.png";
import { setOpenRaiseBar } from "../store/slices/game";

const Buttons = () => {
  const { gameState } = useAppSelector((state) => state.game);
  // const gameState = {
  //   winner: false,
  //   playerTurn: { coins: 5000, playerPot: 50 },
  //   minRaiseAmount: 50,
  //   draw: { isDraw: false },
  //   lastBet: 0,
  //   players: [{ coins: 50 }],
  // };
  const { playAudio } = useContext(AudioContext);
  const { handleFold, handleCheck, handleCall } = useContext(GameContext);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const playerTurn = gameState?.playerTurn;

  if (gameState?.winner || gameState?.draw.isDraw) return null;

  if (!playerTurn?.coins || !gameState?.minRaiseAmount) return null;

  let callAmount = gameState!.lastBet - playerTurn!.playerPot;

  if (callAmount && callAmount > playerTurn?.coins) {
    callAmount = playerTurn?.coins;
  }

  const canCheck = callAmount <= 0;
  const allIn = gameState?.players.some((player) => player.coins === 0);

  const canRaise = playerTurn?.coins >= gameState?.minRaiseAmount && !allIn;

  return (
    <>
      <button
        onClick={() => {
          playAudio(clickSound);
          handleFold(id);
        }}
        className="button-border bg-gray-900 px-8 xl:py-2 bg-red-700 hover:bg-red-600 rounded-full text-[0.9rem] xl:text-2xl"
      >
        FOLD
      </button>
      {!canCheck && (
        <button
          onClick={() => {
            playAudio(clickSound);
            handleCall(callAmount!, id);
          }}
          className="button-border flex space-x-3 items-center bg-gray-900 px-8 xl:py-2 hover:bg-gray-800 rounded-full text-[1rem] xl:text-2xl"
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
          onClick={() => {
            playAudio(clickSound);
            handleCheck(id);
          }}
          className="button-border flex space-x-3 items-center bg-gray-900 px-8 xl:py-2 hover:bg-gray-800 rounded-full text-[1rem] xl:text-2xl"
        >
          <span>CHECK</span>
        </button>
      )}

      {canRaise && (
        <button
          onClick={() => {
            playAudio(clickSound);
            dispatch(setOpenRaiseBar(true));
          }}
          className="button-border bg-gray-900 px-8 xl:py-2 bg-green-700 hover:bg-green-600 rounded-full text-[1rem] xl:text-2xl"
        >
          RAISE
        </button>
      )}
    </>
  );
};

export default Buttons;
