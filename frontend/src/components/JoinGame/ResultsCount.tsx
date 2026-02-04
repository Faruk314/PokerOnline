import React from "react";

interface ResultsCountProps {
  filteredCount: number;
  totalCount: number;
  searchQuery: string;
  onClearSearch: () => void;
}

const ResultsCount: React.FC<ResultsCountProps> = ({
  filteredCount,
  totalCount,
  searchQuery,
  onClearSearch,
}) => {
  return (
    <div className="mb-4 md:mb-8 flex justify-center">
      <div className="inline-flex items-center gap-2 md:gap-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-2 md:px-6 md:py-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-blue-500 animate-pulse"></div>
          <span className="text-gray-300 text-xs md:text-base">
            Showing <span className="text-white font-bold">{filteredCount}</span>{" "}
            of <span className="text-white font-bold">{totalCount}</span> tables
          </span>
        </div>
        {searchQuery && (
          <button
            onClick={onClearSearch}
            className="text-xs md:text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 transition-all duration-300"
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
};

export default ResultsCount;
