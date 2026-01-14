import { useContext } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { AudioContext } from "../context/AudioContext";

const Menu = () => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { id } = useParams<{ id: string }>();
  const { volumeOn, handleVolume } = useContext(AudioContext);

  const handlePlayerLeave = () => {
    socket?.emit("leaveRoom", { roomId: id });
    navigate("/menu");
  };

  return (
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
          onClick={() => handlePlayerLeave()}
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
  );
};

export default Menu;
