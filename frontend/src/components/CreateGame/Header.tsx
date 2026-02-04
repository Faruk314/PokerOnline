import React from "react";
import { IoArrowBack } from "react-icons/io5";

interface HeaderProps {
  onBack: () => void;
}

const Header: React.FC<HeaderProps> = ({ onBack }) => {
  return (
    <div className="relative z-10">
      <div className="px-3 py-2 md:px-6 md:py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <div className="flex items-center gap-3 md:gap-6">
              <button
                onClick={onBack}
                className="relative group px-3 py-2 md:px-4 md:py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <IoArrowBack className="relative text-xl md:text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
              </button>

              <div className="hidden md:flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                <h2 className="text-2xl font-black text-white">
                  CREATE{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                    GAME
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
