import { useContext, useState } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AudioContext } from "../context/AudioContext";

const Menu = () => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { id } = useParams<{ id: string }>();
  const { volumeOn, handleVolume } = useContext(AudioContext);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const handlePlayerLeave = () => {
    socket?.emit("leaveRoom", { roomId: id });
    navigate("/menu");
  };

  const handleExitConfirmation = () => {
    setShowExitConfirmation(true);
  };

  const handleConfirmExit = () => {
    handlePlayerLeave();
    setShowExitConfirmation(false);
  };

  const handleCancelExit = () => {
    setShowExitConfirmation(false);
  };

  return (
    <>
      <div className="absolute rounded-2xl w-48 shadow-2xl top-14 right-0 text-white z-50">
        {/* Glassmorphism Background */}
        <div className="relative bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
          {/* Animated Border Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-2xl blur opacity-20 animate-gradient-x"></div>

          {/* Volume Button */}
          <button
            onClick={handleVolume}
            className="relative group py-4 px-6 hover:bg-gradient-to-r hover:from-yellow-500/10 hover:to-red-500/10 w-full flex items-center justify-center gap-3 transition-all duration-300 border-b border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              {volumeOn ? (
                <FaVolumeUp className="text-xl text-yellow-400 group-hover:text-yellow-300 transition-colors" />
              ) : (
                <FaVolumeMute className="text-xl text-red-400 group-hover:text-red-300 transition-colors" />
              )}
              <span className="font-semibold text-sm tracking-wide">
                {volumeOn ? "Mute Audio" : "Unmute Audio"}
              </span>
            </div>
          </button>

          {/* Exit Game Button */}
          <button
            onClick={handleExitConfirmation}
            className="relative group py-4 px-6 hover:bg-gradient-to-r hover:from-red-500/10 hover:to-purple-500/10 w-full flex items-center justify-center gap-3 transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-red-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="relative flex items-center gap-3">
              <svg
                className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              <span className="font-semibold text-sm tracking-wide text-red-300 group-hover:text-red-200 transition-colors">
                Exit Game
              </span>
            </div>
          </button>

          {/* Floating Glow Effect */}
          <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-gradient-to-r from-yellow-500/20 to-red-500/20 rounded-full blur-xl"></div>
        </div>
      </div>

      {/* Exit Confirmation Modal */}
      {showExitConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-black/80 via-gray-950/90 to-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md mx-4">
            {/* Animated Border Glow */}
            <div className="absolute -inset-4 bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

            {/* Main Card */}
            <div className="relative bg-gradient-to-b from-gray-900/95 to-gray-950/95 backdrop-blur-xl rounded-3xl border border-white/10 p-8 shadow-2xl">
              {/* Warning Icon */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="absolute -inset-6 bg-gradient-to-r from-red-500/30 to-orange-500/30 rounded-full blur-xl animate-pulse"></div>
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-red-500 to-orange-600 flex items-center justify-center border-8 border-gray-900/50">
                    <svg
                      className="w-10 h-10 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      ></path>
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirmation Message */}
              <div className="text-center mb-8">
                <h3 className="text-2xl font-bold text-white mb-3">
                  Exit Game?
                </h3>
                <p className="text-gray-300">
                  Are you sure you want to leave the game? Your current progress
                  will be lost.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleCancelExit}
                  className="relative group flex-1 py-3 px-6 rounded-xl text-white text-base font-semibold tracking-wide transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-gray-500/30 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-500/10 to-gray-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative">Cancel</span>
                </button>

                <button
                  onClick={handleConfirmExit}
                  className="relative group flex-1 py-3 px-6 rounded-xl text-white text-base font-semibold tracking-wide transition-all duration-300 overflow-hidden bg-gradient-to-r from-red-600 via-orange-500 to-red-600 shadow-[0_0_30px_rgba(249,115,22,0.4)] hover:shadow-[0_0_40px_rgba(249,115,22,0.6)] hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-400 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      ></path>
                    </svg>
                    Exit Game
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Menu;
