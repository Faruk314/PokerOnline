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
  const { playAudio } = useContext(AudioContext);
  const { handleFold, handleCheck, handleCall } = useContext(GameContext);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  if (gameState?.winner || gameState?.draw.isDraw) return null;

  const playerTurn = gameState?.playerTurn;
  const callAmount = gameState!.lastBet - playerTurn!.playerPot;

  const canCheck = callAmount <= 0;
  const allIn = gameState?.players.some((player) => player.coins === 0);

  return (
    <>
      <button
        onClick={() => {
          playAudio(clickSound);
          handleFold(id);
        }}
        className="button-border bg-gray-900 px-8 py-2 bg-red-700 hover:bg-red-600 rounded-full"
      >
        FOLD
      </button>
      {!canCheck && (
        <button
          onClick={() => {
            playAudio(clickSound);
            handleCall(callAmount!, id);
          }}
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
          onClick={() => {
            playAudio(clickSound);
            handleCheck(id);
          }}
          className="button-border flex space-x-3 items-center bg-gray-900 px-8 py-2 hover:bg-gray-800 rounded-full"
        >
          <span>CHECK</span>
        </button>
      )}

      {!allIn && (
        <button
          onClick={() => {
            playAudio(clickSound);
            dispatch(setOpenRaiseBar(true));
          }}
          className="button-border bg-gray-900 px-8 py-2 bg-green-700 hover:bg-green-600 rounded-full"
        >
          RAISE
        </button>
      )}
    </>
  );
};

export default Buttons;
