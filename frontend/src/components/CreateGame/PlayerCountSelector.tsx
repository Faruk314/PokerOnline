import React from "react";
import classNames from "classnames";

interface PlayerCountSelectorProps {
  selected: number | null;
  options: number[];
  onSelect: (value: number) => void;
}

const PlayerCountSelector: React.FC<PlayerCountSelectorProps> = ({
  selected,
  options,
  onSelect,
}) => {
  return (
    <div className="mb-6 md:mb-10">
      <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-4 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"></div>
          Number of Players
        </div>
      </label>
      <div className="grid grid-cols-5 gap-2 md:gap-3">
        {options.map((item) => (
          <button
            onClick={() => onSelect(item)}
            key={item}
            className={classNames(
              "relative group w-full p-2 md:px-4 md:py-4 rounded-xl border transition-all duration-300 hover:scale-105 aspect-square flex flex-col items-center justify-center",
              selected === item
                ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-500/50 shadow-[0_0_20px_rgba(202,138,4,0.3)]"
                : "bg-gradient-to-r from-gray-900/80 to-gray-950/80 border-white/10 hover:border-yellow-500/30"
            )}
          >
            <div
              className={classNames(
                "text-lg md:text-2xl font-black transition-colors",
                selected === item
                  ? "text-white"
                  : "text-gray-400 group-hover:text-white"
              )}
            >
              {item}
            </div>
            <div
              className={classNames(
                "text-[8px] md:text-xs mt-0.5 md:mt-1 transition-colors hidden sm:block",
                selected === item
                  ? "text-yellow-200"
                  : "text-gray-500 group-hover:text-gray-300"
              )}
            >
              PLAYERS
            </div>
            {selected === item && (
              <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PlayerCountSelector;
