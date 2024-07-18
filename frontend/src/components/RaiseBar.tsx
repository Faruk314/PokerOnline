import React, { useState } from "react";
import { IoCaretBackOutline } from "react-icons/io5";
import chip from "../assets/images/chip.png";

interface Props {
  setOpenRaiseBar: React.Dispatch<React.SetStateAction<boolean>>;
  handleRaise: (amount: number) => void;
  maxAmount?: number;
}

const RaiseBar = ({ setOpenRaiseBar, handleRaise, maxAmount }: Props) => {
  const [amount, setAmount] = useState("10");

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

      <input
        onChange={(e) => setAmount(e.target.value)}
        type="range"
        className="slider"
        min="1"
        max={maxAmount}
        value={amount}
      />

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
