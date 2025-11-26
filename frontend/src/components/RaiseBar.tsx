import { ChangeEvent, useState } from "react";
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

  const minRaiseAmount =
    gameState?.lastMaxBet && gameState?.minRaiseDiff
      ? gameState.lastMaxBet + gameState.minRaiseDiff
      : 0;

  const maxRaiseAmount = gameState?.playerTurn?.coins ?? 0;

  const [amount, setAmount] = useState(minRaiseAmount);

  if (!gameState?.playerTurn) return null;

  const handleIncrement = () => {
    setAmount((prev) => Math.min(prev + 25, maxRaiseAmount));
  };

  const handleDecrement = () => {
    setAmount((prev) => Math.max(prev - 25, minRaiseAmount));
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    let newAmount = parseInt(e.target.value);
    if (isNaN(newAmount)) return;

    if (newAmount > maxRaiseAmount) newAmount = maxRaiseAmount;
    if (newAmount < minRaiseAmount) newAmount = minRaiseAmount;

    setAmount(newAmount);
  };

  const handleMove = () => {
    handleRaise(amount, id);
    dispatch(setOpenRaiseBar(false));
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex items-center space-x-2 self-end">
        <input
          type="number"
          value={amount}
          onChange={handleInput}
          className="text-black w-[6rem] xl:w-[8rem] h-[2.5rem] xl:h-[3rem] px-2 text-[0.7rem] rounded-md outline-none"
        />
      </div>

      <div className="flex items-center space-x-4">
        <div className="text-white flex space-x-2 items-center">
          <span>{amount}</span>
          <img src={chip} className="h-6 w-6" />
        </div>

        <button
          onClick={() => dispatch(setOpenRaiseBar(false))}
          className="button-border flex items-center bg-gray-900 rounded-md p-2"
        >
          <IoCaretBackOutline />
        </button>

        <button
          onClick={handleDecrement}
          className="button-border bg-red-600 text-xl rounded-full p-2"
        >
          <FaMinus />
        </button>

        <input
          type="range"
          className="slider"
          min={minRaiseAmount}
          max={maxRaiseAmount}
          step={25}
          value={amount}
          onChange={(e) => setAmount(parseInt(e.target.value))}
        />

        <button
          onClick={handleIncrement}
          className="button-border bg-green-600 text-xl rounded-full p-2"
        >
          <FaPlus />
        </button>

        <button
          onClick={handleMove}
          className="button-border bg-gray-900 p-2 rounded-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default RaiseBar;
