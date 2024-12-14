import React, { useRef } from "react";
import Wrapper from "./Wrapper";
import { TGameEndReason } from "../types/types";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  reason: TGameEndReason | null;
}

const GameOver = ({ setOpenModal, reason }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);

  return (
    <Wrapper setOpenModal={setOpenModal} modalRef={modalRef}>
      <div
        ref={modalRef}
        className="text-white font-bold relative z-40 w-[30rem] p-6 mx-2 space-y-4 bg-gray-800 rounded-md button-border"
      >
        <p className="text-2xl">Game over</p>
        <p>
          {reason === "insufficientFunds" &&
            "Game ended do to insufficient funds"}
          {reason === "opponentInsufficientFunds" &&
            "Game ended do to opponent insufficient funds"}
          {reason === "opponentLeft" && "All players left"}
        </p>

        <button
          onClick={() => setOpenModal(false)}
          className="button-border p-2 w-[7rem] bg-green-700 hover:bg-green-600 rounded-full"
        >
          Continue
        </button>
      </div>
    </Wrapper>
  );
};

export default GameOver;
