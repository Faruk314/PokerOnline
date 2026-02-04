import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import toast from "../utils/toast";

import Background from "../components/CreateGame/Background";
import Header from "../components/CreateGame/Header";
import RoomNameInput from "../components/CreateGame/RoomNameInput";
import StakeSelector from "../components/CreateGame/StakeSelector";
import BigBlindInput from "../components/CreateGame/BigBlindInput";
import PlayerCountSelector from "../components/CreateGame/PlayerCountSelector";
import ActionButtons from "../components/CreateGame/ActionButtons";
import FooterNote from "../components/CreateGame/FooterNote";

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
      <Background />

      <Header onBack={() => navigate("/menu")} />

      {/* Main Content */}
      <div className="relative z-10 flex-1 overflow-visible pb-8">
        <div className="h-full flex flex-col items-center justify-start md:justify-center px-2 py-4 md:px-4 md:py-8">
          <div className="relative w-full max-w-2xl">
            {/* Animated Border Glow */}
            <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600 via-red-600 to-purple-600 rounded-3xl blur-2xl opacity-20 animate-gradient-x"></div>

            {/* Glassmorphism Container */}
            <div className="relative bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-xl rounded-3xl border border-white/10 p-4 md:p-8 shadow-2xl">
              {/* Form Header */}
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

              <RoomNameInput
                value={roomSettings.roomName}
                onChange={(val) => handleChange("roomName", val)}
              />

              <StakeSelector
                minStake={roomSettings.minStake}
                stakes={stakes}
                openDropdown={openDropdown}
                setOpenDropDown={setOpenDropDown}
                onSelect={(val) => handleClick("minStake", val)}
              />

              <BigBlindInput
                value={roomSettings.bigBlind}
                onChange={(val) => handleChange("bigBlind", val)}
              />

              <PlayerCountSelector
                selected={roomSettings.maxPlayers}
                options={playerNums}
                onSelect={(val) => handleClick("maxPlayers", val)}
              />

              <ActionButtons
                onBack={() => navigate("/menu")}
                onConfirm={handleConfirm}
              />

              <FooterNote />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CreateGame;
