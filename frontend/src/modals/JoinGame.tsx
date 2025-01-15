import { useContext, useEffect, useRef } from "react";
import Wrapper from "./Wrapper";
import { IoClose, IoPersonSharp } from "react-icons/io5";
import logo from "../assets/images/pokerlogo.png";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRooms } from "../store/slices/game";
import { SocketContext } from "../context/SocketContext";
import chipSM from "../assets/images/chip.png";
import { FiLogIn } from "react-icons/fi";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinGame = ({ setOpenModal }: Props) => {
  const { socket } = useContext(SocketContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { gameRooms } = useAppSelector((state) => state.game);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  const handleJoin = (id: string) => {
    socket?.emit("joinRoom", { roomId: id });
  };

  return (
    <Wrapper setOpenModal={setOpenModal} modalRef={modalRef}>
      <div
        ref={modalRef}
        className="relative z-40 w-[21rem] md:w-[30rem] mx-2 max-h-[30rem] overflow-y-auto h-[30rem] space-y-4 bg-gray-800 rounded-md button-border"
      >
        <div className="sticky w-full bg-gray-800 border-b border-black top-0 right-0 p-6 bg-gray-800 flex items-center justify-between">
          <h2 className="text-2xl">Join Game</h2>
          <button onClick={() => setOpenModal(false)} className="text-3xl">
            <IoClose />
          </button>
        </div>

        <div className="flex flex-col space-y-2 text-[0.9rem] px-4 md:px-6 pt-2 pb-6">
          {gameRooms.map((gameRoom) => (
            <div
              key={gameRoom.roomId}
              className="button-border py-2 px-3 rounded-md flex justify-between"
            >
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
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default JoinGame;
