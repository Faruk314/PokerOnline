import React from "react";

interface BigBlindInputProps {
  value: number;
  onChange: (value: number) => void;
}

const BigBlindInput: React.FC<BigBlindInputProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4 md:mb-8">
      <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-3 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
          Big Blind Amount
          <span className="text-gray-500 text-[10px] md:text-xs ml-1 md:ml-2">
            (Default: 50)
          </span>
        </div>
      </label>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
        <input
          type="number"
          step="5"
          min="5"
          defaultValue={value}
          onKeyDown={(e) => {
            if (e.key === "." || e.key === ",") {
              e.preventDefault();
            }
          }}
          onChange={(e) => onChange(Number(e.target.value))}
          className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
          placeholder="Enter big blind amount..."
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs md:text-sm">
          CHIPS
        </div>
      </div>
    </div>
  );
};

export default BigBlindInput;
