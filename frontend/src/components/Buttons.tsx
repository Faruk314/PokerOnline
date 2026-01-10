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
  const { handleFold, handleCheck, handleCall, handleRaise } =
    useContext(GameContext);
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const playerTurn = gameState?.playerTurn;

  if (!gameState || gameState.isGameOver || !playerTurn?.coins) return null;

  const playersWhoNeedToAct = gameState.players.filter(
    (p) =>
      !p.isFold &&
      !p.isAllIn &&
      p.playerInfo.userId !== playerTurn.playerInfo.userId
  );

  let minRaiseAmount = gameState.lastMaxBet + gameState.minRaiseDiff;

  if (minRaiseAmount > gameState?.playerTurn.coins) {
    minRaiseAmount = gameState.playerTurn.coins;
  }

  const isAllin = minRaiseAmount === gameState.playerTurn.coins;

  let callAmount = gameState.lastMaxBet - playerTurn.playerPot;

  const isAllInCall = playerTurn.coins <= callAmount;

  if (isAllInCall) callAmount = playerTurn.coins;

  const canCheck = callAmount <= 0;

  const showRaise = !isAllInCall && playersWhoNeedToAct.length > 0;

  const isBet = gameState.lastMaxBet === 0;

  const raiseButtonLabel = isAllin ? "ALL IN" : isBet ? "BET" : "RAISE";

  return (
    <div className="flex space-x-3">
      <button
        onClick={() => {
          playAudio(clickSound);
          handleFold(id);
        }}
        className="button-border bg-red-700 hover:bg-red-600 w-[10rem] py-2 rounded-full text-2xl"
      >
        FOLD
      </button>

      {!canCheck && (
        <button
          onClick={() => {
            handleCall(callAmount, id);
          }}
          className="button-border flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 w-[10rem] py-2 rounded-full text-2xl"
        >
          <span>{isAllInCall ? "ALL IN" : "CALL"}</span>
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
          className="button-border bg-gray-800 hover:bg-gray-700 w-[10rem] py-2 rounded-full text-2xl"
        >
          CHECK
        </button>
      )}

      {showRaise && (
        <button
          onClick={() => {
            if (isAllin) return handleRaise(playerTurn.coins, id);

            dispatch(setOpenRaiseBar(true));
          }}
          className="button-border flex justify-center items-center space-x-2 bg-green-700 hover:bg-green-600 w-[10rem] py-2 rounded-full text-2xl"
        >
          <span>{raiseButtonLabel}</span>

          {isAllin && (
            <div className="flex items-center space-x-1">
              <span>{playerTurn.coins}</span>
              <img src={chip} className="w-4 h-4" />
            </div>
          )}
        </button>
      )}
    </div>
  );
};

export default Buttons;
