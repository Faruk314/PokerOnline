import { useContext } from "react";
import { FiLogIn } from "react-icons/fi";
import { IoPersonSharp } from "react-icons/io5";
import { SocketContext } from "../context/SocketContext";
import { GameRoom } from "../types/types";
import logo from "../assets/images/pokerlogo.png";
import chipSM from "../assets/images/chip.png";

interface Props {
  gameRoom: GameRoom;
}

const RoomCard = ({ gameRoom }: Props) => {
  const { socket } = useContext(SocketContext);

  const handleJoin = (id: string) => {
    socket?.emit("joinRoom", { roomId: id });
  };

  return (
    <div 
      onClick={() => handleJoin(gameRoom.roomId)}
      className="relative group cursor-pointer bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl p-7 hover:border-blue-500/30 hover:scale-[1.02] transition-all duration-500 shadow-2xl"
    >
      {/* Enhanced Background Glow on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-indigo-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Animated Border Effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

      {/* Main Content Layout */}
      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
        {/* Left Section - Room Info */}
        <div className="flex-1">
          {/* Room Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {/* Room Logo with Enhanced Effects */}
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img 
                  src={logo} 
                  className="relative w-16 h-16 rounded-2xl border-2 border-white/20 shadow-lg" 
                  alt="Room Logo" 
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center border-2 border-gray-900">
                  <span className="text-white text-xs font-bold">🎴</span>
                </div>
              </div>

              {/* Room Name and Status */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <h3 className="text-2xl font-black text-white group-hover:text-blue-300 transition-colors duration-300">
                    {gameRoom.roomName}
                  </h3>
                  {gameRoom.players.length === gameRoom.maxPlayers ? (
                    <div className="text-sm bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1.5 rounded-full font-bold shadow-lg">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                        FULL
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-full font-bold shadow-lg animate-pulse">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                        OPEN
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Room ID Badge */}
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-gray-400 text-sm font-mono">
                    ID: {gameRoom.roomId.slice(0, 8)}...
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Game Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Minimum Stake */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 group/stat hover:border-yellow-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <img src={chipSM} className="w-8 h-8" alt="Chip" />
                  <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">MIN STAKE</div>
                  <div className="text-2xl font-bold text-white">
                    {gameRoom.minStake.toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-400 text-xs">Starting chips required</div>
            </div>

            {/* Big Blind */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 group/stat hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">BB</span>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">BIG BLIND</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(gameRoom.minStake / 10).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-400 text-xs">Current blind amount</div>
            </div>

            {/* Small Blind */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 group/stat hover:border-green-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">SB</span>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">SMALL BLIND</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(gameRoom.minStake / 20).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-400 text-xs">Half of big blind</div>
            </div>

            {/* Buy-in Range */}
            <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/10 rounded-xl p-4 group/stat hover:border-purple-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-sm font-bold">💰</span>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">BUY-IN</div>
                  <div className="text-2xl font-bold text-white">
                    {Math.floor(gameRoom.minStake * 2).toLocaleString()}
                  </div>
                </div>
              </div>
              <div className="text-gray-400 text-xs">Recommended buy-in</div>
            </div>
          </div>
        </div>

        {/* Right Section - Players & Action */}
        <div className="md:w-64 flex flex-col gap-6">
          {/* Players Section */}
          <div className="bg-gradient-to-br from-gray-900/50 to-gray-950/50 backdrop-blur-sm border border-white/10 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <IoPersonSharp className="text-3xl text-gray-400 group-hover:text-blue-400 transition-colors duration-300" />
                  <div className="absolute -inset-3 bg-blue-500/10 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div>
                  <div className="text-gray-500 text-xs uppercase tracking-wider">PLAYERS</div>
                  <div className="text-3xl font-black text-white">
                    {gameRoom.players.length}
                    <span className="text-gray-500 text-xl">/{gameRoom.maxPlayers}</span>
                  </div>
                </div>
              </div>
              
              {/* Player Progress Bar */}
              <div className="w-24">
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden mb-1">
                  <div 
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${(gameRoom.players.length / gameRoom.maxPlayers) * 100}%` }}
                  ></div>
                </div>
                <div className="text-gray-500 text-xs text-right">
                  {Math.round((gameRoom.players.length / gameRoom.maxPlayers) * 100)}% full
                </div>
              </div>
            </div>

            {/* Player Avatars (if any) */}
            {gameRoom.players.length > 0 && (
              <div className="flex -space-x-3">
                {gameRoom.players.slice(0, 4).map((player, index) => (
                  <div key={index} className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-2 border-white/20 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {player.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {index === 3 && gameRoom.players.length > 4 && (
                      <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">
                          +{gameRoom.players.length - 4}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Join Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleJoin(gameRoom.roomId);
            }}
            className="relative group/btn w-full py-4 rounded-2xl text-white text-base font-bold tracking-widest transition-all duration-500 overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-blue-600 shadow-[0_0_40px_rgba(59,130,246,0.5)] hover:shadow-[0_0_60px_rgba(59,130,246,0.7)] hover:scale-[1.03] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            disabled={gameRoom.players.length === gameRoom.maxPlayers}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
            <span className="relative flex items-center justify-center gap-3">
              <div className="w-4 h-4 rounded-full bg-white animate-pulse"></div>
              {gameRoom.players.length === gameRoom.maxPlayers ? (
                <>
                  <FiLogIn className="text-xl" />
                  TABLE FULL
                </>
              ) : (
                <>
                  <FiLogIn className="text-xl" />
                  JOIN TABLE
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </>
              )}
            </span>
          </button>
        </div>
      </div>

      {/* Enhanced Status Indicator */}
      {gameRoom.players.length === gameRoom.maxPlayers ? (
        <div className="absolute -top-3 -right-3">
          <div className="relative bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl">
            <div className="absolute -inset-2 bg-red-400 rounded-full blur-xl opacity-30"></div>
            <span className="relative flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              TABLE FULL
            </span>
          </div>
        </div>
      ) : gameRoom.players.length >= gameRoom.maxPlayers - 1 ? (
        <div className="absolute -top-3 -right-3">
          <div className="relative bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-sm font-bold px-4 py-2 rounded-full shadow-2xl animate-pulse">
            <div className="absolute -inset-2 bg-yellow-400 rounded-full blur-xl opacity-30"></div>
            <span className="relative flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-black"></div>
              ALMOST FULL
            </span>
          </div>
        </div>
      ) : gameRoom.players.length === 0 ? (
        <div className="absolute -top-3 -right-3">
          <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-2xl">
            <div className="absolute -inset-2 bg-green-400 rounded-full blur-xl opacity-30"></div>
            <span className="relative flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
              EMPTY TABLE
            </span>
          </div>
        </div>
      ) : null}

      {/* Quick Join Hint */}
      <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-gradient-to-r from-gray-900 to-gray-950 border border-white/10 rounded-full px-4 py-1.5 shadow-lg">
          <span className="text-gray-400 text-xs">Click anywhere to join</span>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
