import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRooms } from "../store/slices/game";
import Loader from "../components/Loader";
import RoomCard from "../components/RoomCard";
import { IoArrowBack, IoRefresh, IoSearch } from "react-icons/io5";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import chipSM from "../assets/images/chip.png";
import classNames from "classnames";

const JoinGame = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { gameRooms } = useAppSelector((state) => state.game);
  const roomsLoading = useAppSelector((state) => state.game.isLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [minStakeFilter, setMinStakeFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"players" | "stake" | "name">("players");
  const [openStakeDropdown, setOpenStakeDropdown] = useState(false);
  const [openSortDropdown, setOpenSortDropdown] = useState(false);
  const stakeDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const stakes = [500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  const sortOptions = [
    { value: "players", label: "Most Players First", icon: "👥" },
    { value: "stake", label: "Lowest Stake First", icon: "💰" },
    { value: "name", label: "Alphabetical", icon: "🔤" },
  ];

  useEffect(() => {
    dispatch(fetchRooms());

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      dispatch(fetchRooms());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

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

  const handleRefresh = () => {
    dispatch(fetchRooms());
  };

  const handleBackToMenu = () => {
    navigate("/menu");
  };

  const handleStakeClick = (stake: number | null) => {
    setMinStakeFilter(stake);
    setOpenStakeDropdown(false);
  };

  const handleStakeDropdownClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenStakeDropdown((prev) => !prev);
  };

  const handleSortDropdownClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setOpenSortDropdown((prev) => !prev);
  };

  const handleSortClick = (value: "players" | "stake" | "name") => {
    setSortBy(value);
    setOpenSortDropdown(false);
  };

  // Filter and sort rooms
  const filteredRooms = gameRooms
    .filter((room) => {
      // Search filter
      if (
        searchQuery &&
        !room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Stake filter
      if (minStakeFilter !== null && room.minStake < minStakeFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "players":
          return b.players.length - a.players.length; // Most players first
        case "stake":
          return a.minStake - b.minStake; // Lowest stake first
        case "name":
          return a.roomName.localeCompare(b.roomName); // Alphabetical
        default:
          return 0;
      }
    });

  const totalPlayers = gameRooms.reduce(
    (acc, room) => acc + room.players.length,
    0
  );
  const availableTables = gameRooms.filter(
    (room) => room.players.length < room.maxPlayers
  ).length;

  if (roomsLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-950 via-gray-900 to-black">
        <Loader />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-hidden">
      <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-hidden relative">
        {/* Animated Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-[24rem] h-[24rem] max-w-96 max-h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-[24rem] h-[24rem] max-w-96 max-h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-[40rem] h-full max-h-[40rem] bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
        </div>

        {/* Floating Cards Animation */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/3 left-1/5 w-20 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg opacity-10 animate-bounce delay-300 rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/5 w-16 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg opacity-10 animate-bounce delay-700 -rotate-6"></div>
          <div className="absolute top-2/3 left-2/3 w-18 h-26 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg opacity-10 animate-bounce delay-1200 rotate-3"></div>
        </div>

        {/* Header Section */}
        <div className="relative z-10">
          <div className="px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                {/* Back Button and Logo */}
                <div className="flex items-center gap-6">
                  <button
                    onClick={handleBackToMenu}
                    className="relative group flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <IoArrowBack className="relative text-xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
                    <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-yellow-300 group-hover:to-yellow-400 transition-all duration-300">
                      BACK TO MENU
                    </span>
                  </button>
                </div>

                {/* Stats */}
                <div className="hidden md:flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">
                      {gameRooms.length}
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

                {/* Action Buttons */}
                <div className="flex items-center gap-4">
                  {/* Refresh Button */}
                  <button
                    onClick={handleRefresh}
                    className="relative group px-4 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                  >
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative flex items-center gap-3">
                      <IoRefresh className="text-xl text-gray-400 group-hover:text-blue-400 transition-colors group-hover:animate-spin" />
                      <span className="hidden md:inline text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-gray-400 group-hover:from-blue-300 group-hover:to-blue-400 transition-all duration-300">
                        REFRESH
                      </span>
                    </div>
                  </button>

                  {/* Create Table Button */}
                  <button
                    onClick={() => navigate("/create")}
                    className="relative group px-6 py-3 rounded-xl text-white text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)] hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                      CREATE TABLE
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden scrollable-container">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Page Header */}
            <div className="mb-12 text-center">
              <div className="inline-block mb-6">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>
                <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 px-8 py-6 shadow-2xl">
                  <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                    JOIN{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
                      POKER TABLE
                    </span>
                  </h1>
                  <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                    Browse available poker tables, find your perfect match, and
                    join the action
                  </p>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="max-w-4xl mx-auto mb-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {/* Search Input */}
                  <div>
                    <label className="block text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        Search Tables
                      </div>
                    </label>
                    <div className="relative group">
                      <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center">
                        <IoSearch className="absolute left-4 text-gray-500 text-xl" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search by table name..."
                          className="w-full pl-12 pr-4 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stake Filter Dropdown */}
                  <div className="relative" ref={stakeDropdownRef}>
                    <label className="block text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        Minimal Stake
                      </div>
                    </label>
                    <button
                      onClick={handleStakeDropdownClick}
                      className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-between group hover:border-green-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img src={chipSM} className="h-6 w-6" alt="Chip" />
                          <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                        </div>
                        <span className="text-white font-bold text-lg">
                          {minStakeFilter
                            ? minStakeFilter.toLocaleString()
                            : "All Stakes"}
                        </span>
                        <span className="text-gray-400 text-sm">CHIPS</span>
                      </div>
                      <div className="text-2xl text-gray-400 group-hover:text-green-400 transition-colors">
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
                          className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 group transition-all duration-300"
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <img
                                src={chipSM}
                                className="h-5 w-5 opacity-50"
                                alt="Chip"
                              />
                            </div>
                            <span
                              className={classNames(
                                "font-bold text-lg transition-colors",
                                minStakeFilter === null
                                  ? "text-green-400"
                                  : "text-white group-hover:text-green-300"
                              )}
                            >
                              All Stakes
                            </span>
                          </div>
                          {minStakeFilter === null && (
                            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></div>
                          )}
                        </button>
                        {stakes.map((stake) => (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStakeClick(stake);
                            }}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0 group transition-all duration-300"
                            key={stake}
                          >
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <img
                                  src={chipSM}
                                  className="h-5 w-5"
                                  alt="Chip"
                                />
                                <div className="absolute inset-0 bg-green-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                              </div>
                              <span
                                className={classNames(
                                  "font-bold text-lg transition-colors",
                                  minStakeFilter === stake
                                    ? "text-green-400"
                                    : "text-white group-hover:text-green-300"
                                )}
                              >
                                {stake.toLocaleString()}+
                              </span>
                            </div>
                            {minStakeFilter === stake && (
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-green-600 animate-pulse"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Sort By Dropdown */}
                  <div className="relative" ref={sortDropdownRef}>
                    <label className="block text-gray-300 text-sm font-semibold mb-2 uppercase tracking-wider">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                        Sort By
                      </div>
                    </label>
                    <button
                      onClick={handleSortDropdownClick}
                      className="relative w-full px-5 py-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl flex items-center justify-between group hover:border-purple-500/30 transition-all duration-300"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {
                            sortOptions.find((opt) => opt.value === sortBy)
                              ?.icon
                          }
                        </div>
                        <span className="text-white font-bold text-lg">
                          {
                            sortOptions.find((opt) => opt.value === sortBy)
                              ?.label
                          }
                        </span>
                      </div>
                      <div className="text-2xl text-gray-400 group-hover:text-purple-400 transition-colors">
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
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-white/5 border-b border-white/5 last:border-0 group transition-all duration-300"
                            key={option.value}
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-xl">{option.icon}</div>
                              <span
                                className={classNames(
                                  "font-bold text-lg transition-colors",
                                  sortBy === option.value
                                    ? "text-purple-400"
                                    : "text-white group-hover:text-purple-300"
                                )}
                              >
                                {option.label}
                              </span>
                            </div>
                            {sortBy === option.value && (
                              <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-purple-600 animate-pulse"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Count */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-4 bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 rounded-xl px-6 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
                    <span className="text-gray-300">
                      Showing{" "}
                      <span className="text-white font-bold">
                        {filteredRooms.length}
                      </span>{" "}
                      of{" "}
                      <span className="text-white font-bold">
                        {gameRooms.length}
                      </span>{" "}
                      tables
                    </span>
                  </div>
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="text-sm text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-300 hover:to-blue-500 transition-all duration-300"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Rooms Grid */}
            <div className="space-y-8">
              {filteredRooms.length > 0 ? (
                filteredRooms.map((gameRoom) => (
                  <div
                    key={gameRoom.roomId}
                    className="transform transition-all duration-300 hover:scale-[1.01]"
                  >
                    <RoomCard gameRoom={gameRoom} />
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <div className="inline-block max-w-2xl">
                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-indigo-600/20 rounded-3xl blur-2xl"></div>
                    <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-2xl border border-white/10 p-12 shadow-2xl">
                      <h3 className="text-3xl font-bold text-white mb-4">
                        No Tables Found
                      </h3>
                      <p className="text-gray-400 text-lg mb-8 max-w-md mx-auto">
                        {searchQuery || minStakeFilter
                          ? "No tables match your current filters. Try adjusting your search criteria."
                          : "There are no poker tables available at the moment. Be the first to create one!"}
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                          onClick={() => {
                            setSearchQuery("");
                            setMinStakeFilter(null);
                          }}
                          className="relative group px-6 py-3 rounded-xl text-white text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-gray-900/80 to-gray-950/80 border border-white/10 hover:border-blue-500/30"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative">CLEAR FILTERS</span>
                        </button>
                        <button
                          onClick={() => navigate("/create")}
                          className="relative group px-6 py-3 rounded-xl text-white text-sm font-bold tracking-widest transition-all duration-300 overflow-hidden bg-gradient-to-r from-yellow-600 to-yellow-500 shadow-[0_0_20px_rgba(202,138,4,0.3)] hover:shadow-[0_0_30px_rgba(202,138,4,0.5)] hover:scale-105"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <span className="relative flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
                            CREATE TABLE
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Stats */}
            <div className="mt-16 pt-8 border-t border-white/10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-500 mb-2">
                    24/7
                  </div>
                  <div className="text-gray-400 text-sm">Active Support</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-500 mb-2">
                    100%
                  </div>
                  <div className="text-gray-400 text-sm">Secure Games</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-500 mb-2">
                    Fast
                  </div>
                  <div className="text-gray-400 text-sm">Matchmaking</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-yellow-500 mb-2">
                    Fair
                  </div>
                  <div className="text-gray-400 text-sm">Random Dealing</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Info */}
        <div className="relative z-10 border-t border-white/10 bg-gradient-to-t from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-gray-600 text-sm">
                Tables auto-refresh every 30 seconds • Double-click to join
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-gray-300 text-sm">Live Server</span>
                </div>
                <div className="text-gray-600 text-sm">
                  {new Date().toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default JoinGame;
