import React from "react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import classNames from "classnames";
import chipSM from "../../assets/images/chip.png";

interface StakeSelectorProps {
  minStake: number;
  stakes: number[];
  openDropdown: boolean;
  setOpenDropDown: React.Dispatch<React.SetStateAction<boolean>>;
  onSelect: (value: number) => void;
}

const StakeSelector: React.FC<StakeSelectorProps> = ({
  minStake,
  stakes,
  openDropdown,
  setOpenDropDown,
  onSelect,
}) => {
  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenDropDown((prev) => !prev);
  };

  return (
    <div className="mb-4 md:mb-8">
      <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-3 uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
          Minimal Stake
        </div>
      </label>
      <div className="relative">
        <button
          onClick={handleDropdownClick}
          className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-between group hover:border-yellow-500/30 transition-all duration-300"
        >
          <div className="flex items-center gap-2 md:gap-3">
            <div className="relative">
              <img src={chipSM} className="h-5 w-5 md:h-6 md:w-6" alt="Chip" />
              <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
            </div>
            <span className="text-white font-bold text-base md:text-lg">
              {minStake.toLocaleString()}
            </span>
            <span className="text-gray-400 text-xs md:text-sm">CHIPS</span>
          </div>
          <div className="text-xl md:text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors">
            {openDropdown ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
          </div>
        </button>

        {openDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
            {stakes.map((stake) => (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect(stake);
                  setOpenDropDown(false);
                }}
                className="w-full px-4 py-3 md:px-5 md:py-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0 group transition-all duration-300"
                key={stake}
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <img
                      src={chipSM}
                      className="h-4 w-4 md:h-5 md:w-5"
                      alt="Chip"
                    />
                    <div className="absolute inset-0 bg-yellow-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <span
                    className={classNames(
                      "font-bold text-base md:text-lg transition-colors",
                      minStake === stake
                        ? "text-yellow-400"
                        : "text-white group-hover:text-yellow-300"
                    )}
                  >
                    {stake.toLocaleString()}
                  </span>
                </div>
                {minStake === stake && (
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StakeSelector;
