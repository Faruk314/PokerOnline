import { useEffect, useRef } from "react";
import Wrapper from "./Wrapper";
import { IoClose } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchRooms } from "../store/slices/game";
import Loader from "../components/Loader";
import RoomCard from "../components/RoomCard";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const JoinGame = ({ setOpenModal }: Props) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();
  const { gameRooms } = useAppSelector((state) => state.game);
  const roomsLoading = useAppSelector((state) => state.game.isLoading);

  useEffect(() => {
    dispatch(fetchRooms());
  }, [dispatch]);

  if (roomsLoading) {
    return (
      <div className="fixed inset-0">
        <Loader />
      </div>
    );
  }

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
            <RoomCard key={gameRoom.roomId} gameRoom={gameRoom} />
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default JoinGame;
