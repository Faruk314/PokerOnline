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
    <div className="button-border py-2 px-3 rounded-md flex justify-between">
      <div className="flex space-x-4 items-center">
        <img src={logo} className="w-8 h-8 md:w-10 md:h-10" />

        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-1">
            <span>Room:</span>
            <span className="text-green-400">{gameRoom.roomName}</span>
          </div>
          <div className="flex items-center space-x-1">
            <span> Min stake: {gameRoom.minStake}</span>
            <img src={chipSM} className="h-[0.8rem] md:h-[1rem]" />
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 md:space-x-4 text-[1rem] md:text-[1.1rem]">
        <div className="flex items-center space-x-1">
          <IoPersonSharp />
          <p>
            {gameRoom.players.length}/{gameRoom.maxPlayers}
          </p>
        </div>

        <button
          onClick={() => handleJoin(gameRoom.roomId)}
          className="button-border font-bold p-1 w-full md:w-[5rem] bg-green-600 hover:bg-green-500 rounded-full"
        >
          <span className="hidden md:block">JOIN</span>
          <FiLogIn className="md:hidden" />
        </button>
      </div>
    </div>
  );
};

export default RoomCard;
