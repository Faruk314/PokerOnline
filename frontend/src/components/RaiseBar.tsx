import React, { useState } from "react";
import { IoCaretBackOutline } from "react-icons/io5";
import chip from "../assets/images/chip.png";
import { FaMinus, FaPlus } from "react-icons/fa";

interface Props {
  setOpenRaiseBar: React.Dispatch<React.SetStateAction<boolean>>;
  handleRaise: (amount: number) => void;
  maxAmount?: number;
  minAmout?: number;
}

const RaiseBar = ({
  setOpenRaiseBar,
  handleRaise,
  maxAmount,
  minAmout,
}: Props) => {
  const [amount, setAmount] = useState((minAmout! * 2).toString());

  return (
    <div className="flex items-center space-x-4">
      <div className="text-black border-black text-white flex space-x-2 items-center">
        <span>{amount}</span>
        <img src={chip} className="h-6 w-6" />
      </div>

      <button
        onClick={() => setOpenRaiseBar(false)}
        className="button-border flex space-x-3 items-center bg-gray-900 px-2 py-2 hover:bg-gray-800 rounded-md"
      >
        <IoCaretBackOutline size={30} />
      </button>

      <button
        onClick={() => {
          const parsedAm = parseInt(amount);

          if (parsedAm === 1) return;

          const newAmount = parsedAm - 1;

          setAmount(newAmount.toString());
        }}
        className="button-border flex space-x-3 items-center p-2 bg-red-600 text-xl hover:bg-red-500 rounded-full"
      >
        <FaMinus />
      </button>

      <input
        onChange={(e) => setAmount(e.target.value)}
        type="range"
        className="slider"
        min={(minAmout! * 2).toString() || "1"}
        max={maxAmount}
        value={amount}
      />

      <button
        onClick={() => {
          const newAmount = parseInt(amount) + 1;

          setAmount(newAmount.toString());
        }}
        className="button-border flex space-x-3 items-center p-2 bg-green-600 text-xl hover:bg-green-500 rounded-full"
      >
        <FaPlus />
      </button>

      <button
        onClick={() => {
          handleRaise(parseInt(amount));
          setOpenRaiseBar(false);
        }}
        className="button-border flex space-x-3 items-center bg-gray-900 px-2 py-2 hover:bg-gray-800 rounded-md"
      >
        OK
      </button>
    </div>
  );
};

export default RaiseBar;
