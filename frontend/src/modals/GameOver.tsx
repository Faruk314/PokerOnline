import { useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { setGameStatus } from "../store/slices/game";

const GameOver = () => {
  const modalRef = useRef<HTMLDivElement>(null);
  const reason = useAppSelector((state) => state.game.gameStatus.reason);
  const dispatch = useAppDispatch();

  const handleClick = () => {
    const gameStatus = {
      isGameOver: false,
      reason: null,
    };

    dispatch(setGameStatus(gameStatus));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      {/* Animated Border Glow */}
      <div className="absolute -inset-8 bg-gradient-to-r from-red-600 via-yellow-600 to-red-600 rounded-3xl blur-2xl opacity-30 animate-gradient-x"></div>
      
      {/* Glassmorphism Container */}
      <div
        ref={modalRef}
        className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-12 shadow-2xl max-w-md w-full mx-4"
      >
        {/* Game Over Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-500 mb-6 mx-auto">
            <div className="text-4xl">🎴</div>
          </div>
          
          <h2 className="text-4xl font-black text-white mb-2 tracking-wider">GAME OVER</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full mx-auto"></div>
        </div>

        {/* Reason Message */}
        <div className="mb-10">
          <div className="bg-gradient-to-r from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
              <h3 className="text-white font-bold text-lg">REASON</h3>
            </div>
            
            <p className="text-white text-lg">
              {reason === "insufficientFunds" &&
                "Game ended due to insufficient funds"}
              {reason === "opponentInsufficientFunds" &&
                "Game ended due to opponent insufficient funds"}
              {reason === "opponentLeft" && "All players have left the game"}
            </p>
          </div>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleClick}
            className="relative group px-8 py-4 rounded-xl text-white text-base font-bold tracking-wider transition-all duration-300 overflow-hidden bg-gradient-to-r from-green-600 to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 w-full max-w-xs"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative flex items-center justify-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white"></div>
              CONTINUE
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
          </button>
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-500 to-amber-500 opacity-20"></div>
        <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-pink-500 opacity-20"></div>
      </div>
    </div>
  );
};

export default GameOver;
