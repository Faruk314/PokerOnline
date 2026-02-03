import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { SocketContext } from "../context/SocketContext";
import classNames from "classnames";
import toast from "../utils/toast";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import chipSM from "../assets/images/chip.png";

const CreateGame = () => {
  const navigate = useNavigate();
  const [roomSettings, setRoomSettings] = useState({
    maxPlayers: null as number | null,
    minStake: 500,
    roomName: "",
    bigBlind: 50,
  });
  const [openDropdown, setOpenDropDown] = useState(false);
  const { socket } = useContext(SocketContext);

  const stakes = [500, 1000, 10000, 50000, 100000, 500000, 1000000];
  const playerNums = [2, 3, 4, 5, 6];

  const handleConfirm = () => {
    if (roomSettings.roomName.length === 0) {
      return toast.showPokerError("Please enter a room name");
    }
    if (!roomSettings.maxPlayers) {
      return toast.showPokerError("Please add max number of players");
    }
    if (roomSettings.bigBlind % 5 !== 0) {
      return toast.showPokerError("Big blind must be a multiple of 5");
    }
    if (roomSettings.bigBlind > roomSettings.minStake) {
      return toast.showPokerError(
        "Big blind cannot be bigger than the minimum stake"
      );
    }

    if (!socket)
      return console.log("Socket does not exist in create game component");

    socket.emit("createRoom", roomSettings);
    navigate("/menu");
  };

  const handleClick = (key: keyof typeof roomSettings, value: any) => {
    setRoomSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleDropdownClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenDropDown((prev) => !prev);
  };

  const handleChange = (
    key: keyof typeof roomSettings,
    value: string | number
  ) => {
    setRoomSettings((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-y-auto overflow-x-hidden relative">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Poker Chips */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/5 w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full opacity-10 animate-bounce delay-300"></div>
        <div className="absolute bottom-1/3 right-1/5 w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-full opacity-10 animate-bounce delay-700"></div>
        <div className="absolute top-2/3 left-2/3 w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full opacity-10 animate-bounce delay-1200"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10">
        <div className="px-3 py-2 md:px-6 md:py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* Back Button */}
              <div className="flex items-center gap-3 md:gap-6">
                <button
                  onClick={() => navigate("/menu")}
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

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-visible pb-8">
        <div className="h-full flex flex-col items-center justify-start md:justify-center px-2 py-4 md:px-4 md:py-8">
          <div className="relative w-full max-w-2xl">
            {/* Animated Border Glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

            {/* Glassmorphism Container */}
            <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 md:p-8 shadow-2xl">
              {/* Header */}
              <div className="mb-6 md:mb-10 text-center">
                <div className="inline-flex items-center gap-2 md:gap-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-2xl px-4 py-2 md:px-8 md:py-4 mb-4 md:mb-6">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                    <h2 className="text-xl md:text-3xl font-black text-white">
                      CREATE{" "}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">
                        TABLE
                      </span>
                    </h2>
                  </div>
                </div>
                <p className="text-gray-400 text-sm md:text-lg">
                  Customize your poker table settings
                </p>
              </div>

              {/* Room Name Input */}
              <div className="mb-4 md:mb-8">
                <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-3 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-yellow-500"></div>
                    Room Name
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-red-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    onChange={(e) => handleChange("roomName", e.target.value)}
                    className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 focus:ring-2 focus:ring-yellow-500/20 transition-all duration-300"
                    placeholder="Enter your table name..."
                  />
                </div>
              </div>

              {/* Minimal Stake Dropdown */}
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
                        <img
                          src={chipSM}
                          className="h-5 w-5 md:h-6 md:w-6"
                          alt="Chip"
                        />
                        <div className="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
                      </div>
                      <span className="text-white font-bold text-base md:text-lg">
                        {roomSettings.minStake.toLocaleString()}
                      </span>
                      <span className="text-gray-400 text-xs md:text-sm">
                        CHIPS
                      </span>
                    </div>
                    <div className="text-xl md:text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors">
                      {openDropdown ? (
                        <MdKeyboardArrowUp />
                      ) : (
                        <MdKeyboardArrowDown />
                      )}
                    </div>
                  </button>

                  {openDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-gradient-to-b from-gray-900 to-gray-950 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50">
                      {stakes.map((stake) => (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleClick("minStake", stake);
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
                                roomSettings.minStake === stake
                                  ? "text-yellow-400"
                                  : "text-white group-hover:text-yellow-300"
                              )}
                            >
                              {stake.toLocaleString()}
                            </span>
                          </div>
                          {roomSettings.minStake === stake && (
                            <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Big Blind Input */}
              <div className="mb-4 md:mb-8">
                <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-3 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
                    Big Blind Amount
                    <span className="text-gray-500 text-[10px] md:text-xs ml-1 md:ml-2">
                      (Default: 50)
                    </span>
                  </div>
                </label>
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                  <input
                    type="number"
                    step="5"
                    min="5"
                    onKeyDown={(e) => {
                      if (e.key === "." || e.key === ",") {
                        e.preventDefault();
                      }
                    }}
                    onChange={(e) =>
                      handleChange("bigBlind", Number(e.target.value))
                    }
                    className="relative w-full px-4 py-3 md:px-5 md:py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white text-sm md:text-base placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                    placeholder="Enter big blind amount..."
                    defaultValue={roomSettings.bigBlind}
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-xs md:text-sm">
                    CHIPS
                  </div>
                </div>
              </div>

              {/* Number of Players */}
              <div className="mb-6 md:mb-10">
                <label className="block text-gray-300 text-xs md:text-sm font-semibold mb-2 md:mb-4 uppercase tracking-wider">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"></div>
                    Number of Players
                  </div>
                </label>
                <div className="grid grid-cols-5 gap-2 md:gap-3">
                  {playerNums.map((item) => (
                    <button
                      onClick={() => handleClick("maxPlayers", item)}
                      key={item}
                      className={classNames(
                        "relative group w-full p-2 md:px-4 md:py-4 rounded-xl border transition-all duration-300 hover:scale-105 aspect-square flex flex-col items-center justify-center",
                        roomSettings.maxPlayers === item
                          ? "bg-gradient-to-r from-yellow-600 to-yellow-500 border-yellow-500/50 shadow-[0_0_20px_rgba(202,138,4,0.3)]"
                          : "bg-gradient-to-r from-gray-900/80 to-gray-950/80 border-white/10 hover:border-yellow-500/30"
                      )}
                    >
                      <div
                        className={classNames(
                          "text-lg md:text-2xl font-black transition-colors",
                          roomSettings.maxPlayers === item
                            ? "text-white"
                            : "text-gray-400 group-hover:text-white"
                        )}
                      >
                        {item}
                      </div>
                      <div
                        className={classNames(
                          "text-[8px] md:text-xs mt-0.5 md:mt-1 transition-colors hidden sm:block",
                          roomSettings.maxPlayers === item
                            ? "text-yellow-200"
                            : "text-gray-500 group-hover:text-gray-300"
                        )}
                      >
                        PLAYERS
                      </div>
                      {roomSettings.maxPlayers === item && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 animate-pulse"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 md:pt-6 border-t border-white/10 gap-3">
                <button
                  onClick={() => navigate("/menu")}
                  className="relative group flex-1 px-4 py-3 md:px-8 md:py-4 rounded-xl text-white text-xs md:text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-red-500/30 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2 md:gap-3">
                    <IoArrowBack className="text-lg md:text-xl" />
                    BACK
                  </span>
                </button>

                <button
                  onClick={handleConfirm}
                  className="relative group flex-[2] px-4 py-3 md:px-8 md:py-4 rounded-xl text-white text-xs md:text-base font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_30px_rgba(202,138,4,0.4)] hover:shadow-[0_0_40px_rgba(202,138,4,0.6)] hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span className="relative flex items-center justify-center gap-2 md:gap-3">
                    <div className="w-2 h-2 md:w-3 md:h-3 rounded-full bg-white animate-pulse"></div>
                    CREATE TABLE
                    <svg
                      className="w-3 h-3 md:w-4 md:h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      ></path>
                    </svg>
                  </span>
                </button>
              </div>

              {/* Footer Note */}
              <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-white/10">
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 text-[10px] md:text-xs text-gray-500">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500"></div>
                    <span>Secure Connection</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-blue-500"></div>
                    <span>Instant Setup</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-purple-500"></div>
                    <span>Live Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateGame;
