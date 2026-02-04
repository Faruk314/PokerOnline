import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRooms } from "../store/slices/game";
import Loader from "../components/Loader";
import Background from "../components/JoinGame/Background";
import Header from "../components/JoinGame/Header";
import PageTitle from "../components/JoinGame/PageTitle";
import Filters from "../components/JoinGame/Filters";
import ResultsCount from "../components/JoinGame/ResultsCount";
import RoomsGrid from "../components/JoinGame/RoomsGrid";
import FooterStats from "../components/JoinGame/FooterStats";
import BottomInfo from "../components/JoinGame/BottomInfo";

const JoinGame = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { gameRooms } = useAppSelector((state) => state.game);
  const roomsLoading = useAppSelector((state) => state.game.isLoading);

  const [searchQuery, setSearchQuery] = useState("");
  const [minStakeFilter, setMinStakeFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<"players" | "stake" | "name">("players");

  const stakes = [500, 1000, 5000, 10000, 50000, 100000, 500000, 1000000];
  const sortOptions = [
    { value: "players", label: "Most Players First", icon: "👥" },
    { value: "stake", label: "Lowest Stake First", icon: "💰" },
    { value: "name", label: "Alphabetical", icon: "🔤" },
  ];

  useEffect(() => {
    dispatch(fetchRooms());

    const interval = setInterval(() => {
      dispatch(fetchRooms());
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchRooms());
  };

  const filteredRooms = gameRooms
    .filter((room) => {
      if (
        searchQuery &&
        !room.roomName.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      if (minStakeFilter !== null && room.minStake < minStakeFilter) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "players":
          return b.players.length - a.players.length;
        case "stake":
          return a.minStake - b.minStake;
        case "name":
          return a.roomName.localeCompare(b.roomName);
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

  return (
    <div className="w-full overflow-x-hidden">
      <Loader isLoading={roomsLoading} />
      <section className="min-h-screen w-full flex flex-col bg-gradient-to-b from-gray-950 via-gray-900 to-black overflow-y-auto overflow-x-hidden relative">
        <Background />

        <Header
          totalRooms={gameRooms.length}
          totalPlayers={totalPlayers}
          availableTables={availableTables}
          onRefresh={handleRefresh}
          onBack={() => navigate("/menu")}
          onCreate={() => navigate("/create")}
        />

        <div className="relative z-10 flex-1 overflow-visible scrollable-container">
          <div className="max-w-7xl mx-auto px-3 py-4 md:px-8 md:py-8">
            <PageTitle />

            <Filters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              minStakeFilter={minStakeFilter}
              setMinStakeFilter={setMinStakeFilter}
              sortBy={sortBy}
              setSortBy={setSortBy}
              stakes={stakes}
              sortOptions={sortOptions}
            />

            <ResultsCount
              filteredCount={filteredRooms.length}
              totalCount={gameRooms.length}
              searchQuery={searchQuery}
              onClearSearch={() => setSearchQuery("")}
            />

            <RoomsGrid
              rooms={filteredRooms}
              searchQuery={searchQuery}
              minStakeFilter={minStakeFilter}
              onClearFilters={() => {
                setSearchQuery("");
                setMinStakeFilter(null);
              }}
              onCreate={() => navigate("/create")}
            />

            <FooterStats />
          </div>
        </div>

        <BottomInfo />
      </section>
    </div>
  );
};

export default JoinGame;
