import React from "react";

interface RoomNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

const RoomNameInput: React.FC<RoomNameInputProps> = ({ value, onChange }) => {
  return (
    <div className="mb-4 md:mb-8">
      <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-3 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-500"></div>
          Room Name
        </div>
      </label>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
          placeholder="Enter your table name..."
        />
      </div>
    </div>
  );
};

export default RoomNameInput;
