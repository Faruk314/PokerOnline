import { useContext } from "react";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";
import { useAppSelector } from "../store/hooks";
import { AudioContext } from "../context/AudioContext";

const Menu = () => {
  const navigate = useNavigate();
  const { socket } = useContext(SocketContext);
  const { volumeOn, handleVolume } = useContext(AudioContext);
  const { gameState } = useAppSelector((state) => state.game);

  const handlePlayerLeave = () => {
    socket?.emit("leaveRoom", { roomId: gameState?.roomId });
    navigate("/menu");
  };

  return (
    <div className="absolute rounded-md border border-black w-[10rem] shadow-[0_3px_10px_rgb(0,0,0,0.2)] top-[3rem] right-0 text-xl text-white">
      <button
        onClick={handleVolume}
        className="py-2 hover:bg-gray-600 flex items-center space-x-2 hover:rounded-t-md w-full flex items-center justify-center"
      >
        {volumeOn ? <FaVolumeUp /> : <FaVolumeMute />}
        {volumeOn ? <span>Mute</span> : <span>Unmute</span>}
      </button>

      <button
        onClick={() => handlePlayerLeave()}
        className="flex items-center space-x-2 hover:rounded-b-md border-t py-2 border-black hover:bg-gray-600 w-full flex items-center justify-center"
      >
        <span>Exit game</span>
      </button>
    </div>
  );
};

export default Menu;
