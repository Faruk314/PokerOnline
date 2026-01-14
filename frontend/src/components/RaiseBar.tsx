import { useState } from "react";
import { IoCaretBackOutline } from "react-icons/io5";
import chip from "../assets/images/chip.png";
import { FaMinus, FaPlus } from "react-icons/fa";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setOpenRaiseBar } from "../store/slices/game";

const RaiseBar = () => {
  const { gameState } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { handleRaise } = useContext(GameContext);
  const { id } = useParams<{ id: string }>();

  const minRaiseAmount = gameState
    ? gameState.lastMaxBet + gameState.minRaiseDiff
    : 0;

  const isPreflop = gameState?.currentRound === "preFlop";
  const bigBlind = gameState?.bigBlind ?? 0;

  const [amount, setAmount] = useState(minRaiseAmount);

  if (!gameState?.playerTurn) return null;

  const player = gameState.playerTurn;

  const stack = player.coins;
  const callAmount = gameState.lastMaxBet - player.playerPot;
  const pot = gameState.totalPot;

  const maxRaiseAmount = stack;

  const canRaise = stack > callAmount;

  const clamp = (value: number) =>
    Math.min(Math.max(value, minRaiseAmount), maxRaiseAmount);

  const setIfLegal = (value: number) => {
    const v = clamp(value);
    if (v >= minRaiseAmount || v === stack) {
      setAmount(v);
    }
  };

  const handleMove = () => {
    handleRaise(amount, id);
    dispatch(setOpenRaiseBar(false));
  };

  const raiseButtons = isPreflop
    ? [2, 3, 4].map((bb) => bb * bigBlind + callAmount)
    : [0.25, 0.4, 0.6, 1].map((f) => callAmount + Math.floor(pot * f));

  return (
    <div className="flex flex-col gap-4 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 shadow-2xl min-w-[350px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 rounded-full bg-green-500 animate-pulse"></div>
          <h3 className="text-white font-bold text-base">RAISE AMOUNT</h3>
        </div>
        <button
          onClick={() => dispatch(setOpenRaiseBar(false))}
          className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-gray-800/50 rounded-lg"
        >
          <IoCaretBackOutline className="text-xl" />
        </button>
      </div>

      {/* Quick Raise Buttons */}
      <div className="grid grid-cols-4 gap-3">
        {raiseButtons.map((val, idx) => {
          const disabled = !canRaise || val > stack;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => setIfLegal(val)}
              className="px-3 py-3 rounded-xl text-white text-sm font-semibold bg-gradient-to-r from-gray-800 to-gray-900 border border-white/10 hover:border-blue-500/30 hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-white/10 disabled:hover:scale-100"
            >
              {isPreflop
                ? `${Math.round((val - callAmount) / bigBlind)}×BB`
                : `${Math.round(((val - callAmount) / pot) * 100)}%`}
            </button>
          );
        })}

        <button
          disabled={stack <= 0}
          onClick={() => setAmount(stack)}
          className="px-3 py-3 rounded-xl text-white text-sm font-bold bg-gradient-to-r from-red-600 to-red-500 border border-red-500/30 hover:border-red-500/50 hover:scale-105 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          ALL IN
        </button>
      </div>

      {/* Amount Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 flex items-center justify-center">
            <img src={chip} className="w-6 h-6" alt="Chip" />
          </div>
          <div>
            <div className="text-gray-400 text-xs">RAISE AMOUNT</div>
            <div className="text-white font-bold text-2xl">{amount.toLocaleString()}</div>
          </div>
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setIfLegal(+e.target.value)}
          className="w-32 px-4 py-3 bg-gray-800/50 border border-white/10 rounded-xl text-white text-right text-lg focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Slider Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIfLegal(amount - 25)}
          className="p-3 rounded-full bg-gradient-to-r from-red-600 to-red-500 text-white hover:scale-105 transition-transform"
        >
          <FaMinus className="text-base" />
        </button>

        <div className="flex-1">
          <input
            type="range"
            min={minRaiseAmount}
            max={maxRaiseAmount}
            step={1}
            value={amount}
            onChange={(e) => setAmount(+e.target.value)}
            className="slider w-full h-2"
          />
          <div className="flex justify-between text-gray-400 text-sm mt-2">
            <span>MIN: {minRaiseAmount.toLocaleString()}</span>
            <span>MAX: {maxRaiseAmount.toLocaleString()}</span>
          </div>
        </div>

        <button
          onClick={() => setIfLegal(amount + 25)}
          className="p-3 rounded-full bg-gradient-to-r from-green-600 to-green-500 text-white hover:scale-105 transition-transform"
        >
          <FaPlus className="text-base" />
        </button>
      </div>

      {/* Confirm Button */}
      <button
        onClick={handleMove}
        className="mt-2 px-6 py-4 rounded-xl text-white text-base font-bold tracking-wider bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 hover:scale-105 transition-all duration-300"
      >
        CONFIRM RAISE
      </button>
    </div>
  );
};

export default RaiseBar;
