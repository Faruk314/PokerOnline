import { useContext } from "react";
import { FaVolumeMute } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useAppSelector } from "../store/hooks";

const Menu = () => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { gameState } = useAppSelector((state) => state.game);

  const handlePlayerLeave = () => {
    socket?.emit("leaveRoom", { roomId: gameState?.roomId });
    navigate("/menu");
  };

  return (
    <div className="absolute rounded-md border border-black shadow-[0_3px_10px_rgb(0,0,0,0.2)] top-[3rem] right-0 text-xl text-white">
      <button className="px-10 py-2 hover:bg-gray-800 flex items-center space-x-2">
        <FaVolumeMute />
        <span>Mute</span>
      </button>

      <button
        onClick={() => handlePlayerLeave()}
        className="px-10 flex items-center space-x-2 border-t py-2 border-black hover:bg-gray-800"
      >
        <IoClose />
        <span>Exit</span>
      </button>
    </div>
  );
};

export default Menu;
