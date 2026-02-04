import React from "react";
import RoomCard from "../RoomCard";
import { GameRoom } from "../../types/types";

interface RoomsGridProps {
  rooms: GameRoom[];
  searchQuery: string;
  minStakeFilter: number | null;
  onClearFilters: () => void;
  onCreate: () => void;
}

const RoomsGrid: React.FC<RoomsGridProps> = ({
  rooms,
  searchQuery,
  minStakeFilter,
  onClearFilters,
  onCreate,
}) => {
  return (
    <div className="space-y-4 md:space-y-8">
      {rooms.length > 0 ? (
        rooms.map((gameRoom) => (
          <div
            key={gameRoom.roomId}
            className="transform transition-all duration-300 hover:scale-[1.01]"
          >
            <RoomCard gameRoom={gameRoom} />
          </div>
        ))
      ) : (
        <div className="text-center py-10 md:py-20">
          <div className="inline-block max-w-2xl w-full">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl"></div>
            <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-6 md:p-12 shadow-2xl">
              <h3 className="text-xl md:text-3xl font-bold text-white mb-2 md:mb-4">
                No Tables Found
              </h3>
              <p className="text-gray-400 text-sm md:text-lg mb-6 md:mb-8 max-w-md mx-auto">
                {searchQuery || minStakeFilter
                  ? "No tables match your current filters. Try adjusting your search criteria."
                  : "There are no poker tables available at the moment. Be the first to create one!"}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
                <button
                  onClick={onClearFilters}
                  className="relative group px-4 py-3 md:px-6 md:py-3 rounded-xl text-white text-xs md:text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-blue-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">CLEAR FILTERS</span>
                </button>
                <button
                  onClick={onCreate}
                  className="relative group px-4 py-3 md:px-6 md:py-3 rounded-xl text-white text-xs md:text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)] hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center gap-2">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse"></div>
                    CREATE TABLE
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RoomsGrid;
