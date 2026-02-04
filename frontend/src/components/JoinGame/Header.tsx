import React from "react";
import { IoArrowBack, IoRefresh } from "react-icons/io5";

interface HeaderProps {
  totalRooms: number;
  totalPlayers: number;
  availableTables: number;
  onRefresh: () => void;
  onBack: () => void;
  onCreate: () => void;
}

const Header: React.FC<HeaderProps> = ({
  totalRooms,
  totalPlayers,
  availableTables,
  onRefresh,
  onBack,
  onCreate,
}) => {
  return (
    <div className="relative z-10">
      <div className="px-3 py-2 md:px-8 md:py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-6">
              <button
                onClick={onBack}
                className="relative group flex items-center gap-2 md:gap-3 px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <IoArrowBack className="relative text-lg md:text-xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
                <span className="relative text-xs md:text-base text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-yellow-300 group-hover:to-yellow-400 transition-all duration-300">
                  BACK
                </span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {totalRooms}
                </div>
                <div className="text-gray-500 text-xs">ACTIVE TABLES</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">
                  {totalPlayers}
                </div>
                <div className="text-gray-500 text-xs">PLAYERS ONLINE</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">
                  {availableTables}
                </div>
                <div className="text-gray-500 text-xs">OPEN TABLES</div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={onRefresh}
                className="relative group px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative flex items-center gap-2 md:gap-3">
                  <IoRefresh className="text-lg md:text-xl text-gray-400 group-hover:text-blue-400 transition-colors group-hover:animate-spin" />
                  <span className="hidden md:inline text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                    REFRESH
                  </span>
                </div>
              </button>

              <button
                onClick={onCreate}
                className="relative group px-3 py-2 md:px-6 md:py-3 rounded-xl text-white text-xs md:text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)] hover:scale-105"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative flex items-center gap-1 md:gap-2">
                  <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse"></div>
                  CREATE
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
