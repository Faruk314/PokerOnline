import React, { useState, useRef, useEffect } from "react";
import { IoSearch } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import classNames from "classnames";
import chipSM from "../../assets/images/chip.png";

interface FiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  minStakeFilter: number | null;
  setMinStakeFilter: (stake: number | null) => void;
  sortBy: "players" | "stake" | "name";
  setSortBy: (sort: "players" | "stake" | "name") => void;
  stakes: number[];
  sortOptions: { value: string; label: string; icon: string }[];
}

const Filters: React.FC<FiltersProps> = ({
  searchQuery,
  setSearchQuery,
  minStakeFilter,
  setMinStakeFilter,
  sortBy,
  setSortBy,
  stakes,
  sortOptions,
}) => {
  const [openStakeDropdown, setOpenStakeDropdown] = useState(false);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const stakeDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        stakeDropdownRef.current &&
        !stakeDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenStakeDropdown(false);
      }
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setOpenSortDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleStakeClick = (stake: number | null) => {
    setMinStakeFilter(stake);
    setOpenStakeDropdown(false);
  };

  const handleSortClick = (value: "players" | "stake" | "name") => {
    setSortBy(value);
    setOpenSortDropdown(false);
  };

  return (
    <div className="max-w-4xl mx-auto mb-4 md:mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-8">
        <div>
          <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-1 md:mb-2 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
              Search Tables
            </div>
          </label>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center">
              <IoSearch className="absolute left-3 md:left-4 text-gray-500 text-lg md:text-xl" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by table name..."
                className="w-full pl-10 pr-4 py-3 md:pl-12 md:pr-4 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
          </div>
        </div>

        <div className="relative" ref={stakeDropdownRef}>
          <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-1 md:mb-2 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
              Minimal Stake
            </div>
          </label>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenStakeDropdown((prev) => !prev);
            }}
            className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-between group hover:border-green-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="relative">
                <img
                  src={chipSM}
                  className="h-5 w-5 md:h-6 md:w-6"
                  alt="Chip"
                />
                <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
              </div>
              <span className="text-white font-bold text-sm md:text-lg">
                {minStakeFilter
                  ? minStakeFilter.toLocaleString()
                  : "All Stakes"}
              </span>
              <span className="text-gray-400 text-xs md:text-sm">CHIPS</span>
            </div>
            <div className="text-xl md:text-2xl text-gray-400 group-hover:text-green-400 transition-colors">
              {openStakeDropdown ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </div>
          </button>

          {openStakeDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleStakeClick(null);
                }}
                className="w-full px-4 py-3 md:px-5 md:py-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 group transition-all duration-300"
              >
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative">
                    <img
                      src={chipSM}
                      className="h-4 w-4 md:h-5 md:w-5 opacity-50"
                      alt="Chip"
                    />
                  </div>
                  <span
                    className={classNames(
                      "font-bold text-sm md:text-lg transition-colors",
                      minStakeFilter === null
                        ? "text-green-400"
                        : "text-white group-hover:text-green-300"
                    )}
                  >
                    All Stakes
                  </span>
                </div>
                {minStakeFilter === null && (
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></div>
                )}
              </button>
              {stakes.map((stake) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleStakeClick(stake);
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
                      <div className="absolute inset-0 bg-green-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    </div>
                    <span
                      className={classNames(
                        "font-bold text-sm md:text-lg transition-colors",
                        minStakeFilter === stake
                          ? "text-green-400"
                          : "text-white group-hover:text-green-300"
                      )}
                    >
                      {stake.toLocaleString()}+
                    </span>
                  </div>
                  {minStakeFilter === stake && (
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative" ref={sortDropdownRef}>
          <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-1 md:mb-2 uppercase tracking-wider">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"></div>
              Sort By
            </div>
          </label>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setOpenSortDropdown((prev) => !prev);
            }}
            className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-all duration-300"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-lg md:text-2xl">
                {sortOptions.find((opt) => opt.value === sortBy)?.icon}
              </div>
              <span className="text-white font-bold text-sm md:text-lg">
                {sortOptions.find((opt) => opt.value === sortBy)?.label}
              </span>
            </div>
            <div className="text-xl md:text-2xl text-gray-400 group-hover:text-purple-400 transition-colors">
              {openSortDropdown ? (
                <MdKeyboardArrowUp />
              ) : (
                <MdKeyboardArrowDown />
              )}
            </div>
          </button>

          {openSortDropdown && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
              {sortOptions.map((option) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSortClick(
                      option.value as "players" | "stake" | "name"
                    );
                  }}
                  className="w-full px-4 py-3 md:px-5 md:py-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0 group transition-all duration-300"
                  key={option.value}
                >
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="text-base md:text-xl">{option.icon}</div>
                    <span
                      className={classNames(
                        "font-bold text-sm md:text-lg transition-colors",
                        sortBy === option.value
                          ? "text-purple-400"
                          : "text-white group-hover:text-purple-300"
                      )}
                    >
                      {option.label}
                    </span>
                  </div>
                  {sortBy === option.value && (
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Filters;
