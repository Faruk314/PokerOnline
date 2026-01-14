import { useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { AudioContext } from "../context/AudioContext";
import clickSound from "../assets/audio/click.wav";
import { GameContext } from "../context/GameContext";
import { useParams } from "react-router-dom";
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
    <div className="flex gap-4">
      {/* Fold Button */}
      <button
        onClick={() => {
          playAudio(clickSound);
          handleFold(id);
        }}
        className="relative group px-8 py-5 rounded-xl text-white text-base font-bold tracking-wider transition-all duration-300 overflow-hidden bg-gradient-to-r from-red-600 to-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:scale-105 w-[140px] h-[80px] flex items-center justify-center"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white"></div>
          FOLD
        </span>
      </button>

      {/* Call/Check Button */}
      {!canCheck ? (
        <button
          onClick={() => {
            handleCall(callAmount, id);
          }}
          className="relative group px-8 py-5 rounded-xl text-white text-base font-bold tracking-wider transition-all duration-300 overflow-hidden bg-gradient-to-r from-blue-600 to-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] hover:scale-105 w-[140px] h-[80px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              {isAllInCall ? "ALL IN" : "CALL"}
            </div>
            <div className="text-sm opacity-90">
              {callAmount.toLocaleString()}
            </div>
          </span>
        </button>
      ) : (
        <button
          onClick={() => {
            playAudio(clickSound);
            handleCheck(id);
          }}
          className="relative group px-8 py-5 rounded-xl text-white text-base font-bold tracking-wider transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-600 to-gray-500 shadow-[0_0_20px_rgba(107,114,128,0.3)] hover:shadow-[0_0_30px_rgba(107,114,128,0.5)] hover:scale-105 w-[140px] h-[80px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex items-center justify-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white"></div>
            CHECK
          </span>
        </button>
      )}

      {/* Raise/Bet Button */}
      {showRaise && (
        <button
          onClick={() => {
            if (isAllin) return handleRaise(playerTurn.coins, id);
            dispatch(setOpenRaiseBar(true));
          }}
          className="relative group px-8 py-5 rounded-xl text-white text-base font-bold tracking-wider transition-all duration-300 overflow-hidden bg-gradient-to-r from-green-600 to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 w-[140px] h-[80px] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative flex flex-col items-center justify-center gap-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
              {raiseButtonLabel}
            </div>
            {isAllin && (
              <div className="text-sm opacity-90">
                {playerTurn.coins.toLocaleString()}
              </div>
            )}
          </span>
        </button>
      )}
    </div>
  );
};

export default Buttons;
