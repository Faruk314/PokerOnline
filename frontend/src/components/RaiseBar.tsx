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
    <div className="w-[40rem] max-w-full flex flex-col gap-3">
      <div className="flex gap-2">
        {raiseButtons.map((val, idx) => {
          const disabled = !canRaise || val > stack;
          return (
            <button
              key={idx}
              disabled={disabled}
              onClick={() => setIfLegal(val)}
              className="flex-1 button-border bg-gray-900 hover:bg-gray-800 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-gray-900"
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
          className="flex-1 button-border bg-red-700 hover:bg-red-600 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 disabled:bg-red-900 disabled:cursor-not-allowed"
        >
          ALL IN
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white font-semibold">
          <span className="text-xl tabular-nums">{amount}</span>
          <img src={chip} className="h-6 w-6" />
        </div>

        <input
          type="number"
          value={amount}
          onChange={(e) => setIfLegal(+e.target.value)}
          className="w-28 px-2 py-2 text-sm text-black text-right rounded-md outline-none"
        />
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => dispatch(setOpenRaiseBar(false))}
          className="button-border bg-gray-900 hover:bg-gray-800 px-4 py-3 rounded-md shrink-0"
        >
          <IoCaretBackOutline />
        </button>

        <button
          onClick={() => setIfLegal(amount - 25)}
          className="button-border bg-red-600/80 hover:bg-red-600 p-2 rounded-full shrink-0"
        >
          <FaMinus />
        </button>

        <input
          type="range"
          min={minRaiseAmount}
          max={maxRaiseAmount}
          step={1}
          value={amount}
          onChange={(e) => setAmount(+e.target.value)}
          className="slider flex-1 min-w-0"
        />

        <button
          onClick={() => setIfLegal(amount + 25)}
          className="button-border bg-green-600/80 hover:bg-green-600 p-2 rounded-full shrink-0"
        >
          <FaPlus />
        </button>

        <button
          onClick={handleMove}
          className="button-border bg-green-600 hover:bg-green-500 text-white font-bold px-4 py-2 rounded-md shrink-0"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default RaiseBar;
