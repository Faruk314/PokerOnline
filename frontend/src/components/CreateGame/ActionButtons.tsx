import React from "react";
import { IoArrowBack } from "react-icons/io5";

interface ActionButtonsProps {
  onBack: () => void;
  onConfirm: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onBack, onConfirm }) => {
  return (
    <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/10 gap-3">
      <button
        onClick={onBack}
        className="relative group flex-1 px-4 py-3 md:px-8 md:py-4 rounded-xl text-white text-xs md:text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-red-500/30 hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-2 md:gap-3">
          <IoArrowBack className="text-lg md:text-xl" />
          BACK
        </span>
      </button>

      <button
        onClick={onConfirm}
        className="relative group flex-[2] px-4 py-3 md:px-8 md:py-4 rounded-xl text-white text-xs md:text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.4)] hover:shadow-[0_0_40px_rgba(202,138,4,0.6)] hover:scale-105"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative flex items-center justify-center gap-2 md:gap-3">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse"></div>
          CREATE TABLE
          <svg
            className="w-3 h-3 md:w-4 md:h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </span>
      </button>
    </div>
  );
};

export default ActionButtons;
