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
  const [amount, setAmount] = useState(gameState?.minRaiseAmount || 0);
  const minRaiseAmount = gameState?.minRaiseAmount;
  const maxRaiseAmmount = gameState?.playerTurn.coins;
  const { handleRaise } = useContext(GameContext);
  const { id } = useParams<{ id: string }>();

  const handleIncrement = () => {
    if (amount === maxRaiseAmmount) return;

    const newAmount = amount + 25;

    setAmount(newAmount);
  };

  const handleDecrement = () => {
    if (amount === minRaiseAmount) return;

    const newAmount = amount - 25;

    setAmount(newAmount);
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);

    if (!maxRaiseAmmount || !minRaiseAmount) return;

    if (newAmount > maxRaiseAmmount) {
      return setAmount(maxRaiseAmmount);
    }

    if (newAmount <= minRaiseAmount) {
      return setAmount(minRaiseAmount);
    }

    if (!isNaN(newAmount)) {
      setAmount(newAmount);
    }
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
          onChange={handleInput}
          placeholder="Enter amount"
          className="text-black w-[6rem] xl:w-[8rem] h-[2.5rem] xl:h-[3rem] px-2 text-[0.7rem] rounded-md outline-none"
        />
      </div>
      <div className="flex items-center space-x-4">
        <div className="text-black border-black text-white flex space-x-2 items-center">
          <span>{amount}</span>
          <img src={chip} className="h-6 w-6" />
        </div>

        <button
          onClick={() => dispatch(setOpenRaiseBar(false))}
          className="button-border flex space-x-3 items-center text-[1.8rem] xl:text-xl bg-gray-900 xl:px-2 xl:py-2 hover:bg-gray-800 rounded-md"
        >
          <IoCaretBackOutline />
        </button>

        <button
          onClick={handleDecrement}
          className="button-border flex space-x-3 items-center p-1 xl:p-2 bg-red-600 text-xl hover:bg-red-500 rounded-full"
        >
          <FaMinus />
        </button>

        <input
          onChange={(e) => setAmount(parseInt(e.target.value))}
          type="range"
          className="slider"
          min={minRaiseAmount}
          max={maxRaiseAmmount}
          step={25}
          value={amount}
        />

        <button
          onClick={handleIncrement}
          className="button-border flex space-x-3 items-center p-1 xl:p-2 bg-green-600 text-xl hover:bg-green-500 rounded-full"
        >
          <FaPlus />
        </button>

        <button
          onClick={handleMove}
          className="button-border flex space-x-3 items-center bg-gray-900 text-[1.2rem] xl:text-xl px-1 xl:px-2 xl:py-2 hover:bg-gray-800 rounded-md"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default RaiseBar;
