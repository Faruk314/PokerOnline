import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import Wrapper from "./Wrapper";
import { SocketContext } from "../context/SocketContext";
import classNames from "classnames";
import { toast } from "react-toastify";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGame = ({ setOpenModal }: Props) => {
  const [maxPlayers, setMaxPlayers] = useState<number | null>(null);
  const [roomName, setRoomName] = useState("");
  const { socket } = useContext(SocketContext);
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleCreateRoom = () => {
      setOpenModal(false);
      toast.success("Room created");
    };

    socket?.on("roomCreated", handleCreateRoom);

    return () => {
      socket?.off("roomCreated", handleCreateRoom);
    };
  }, [socket]);

  const handleConfirm = () => {
    if (roomName.length === 0) {
      return toast.error("Please enter a room name");
    }

    if (maxPlayers === null) {
      return toast.error("Please add max number of players");
    }

    if (!socket)
      return console.log("Socket does not exist in create game component");

    socket.emit("createRoom", { maxPlayers, roomName });
  };

  const handleClick = (maxPlayers: number) => {
    setMaxPlayers(maxPlayers);
  };

  return (
    <Wrapper setOpenModal={setOpenModal} modalRef={modalRef}>
      <div
        ref={modalRef}
        className="relative z-40 w-[30rem] p-6 mx-2 space-y-4 bg-gray-800 rounded-md button-border"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Create Game</h2>
          <button onClick={() => setOpenModal(false)} className="text-3xl">
            <IoClose />
          </button>
        </div>

        <div className="flex flex-col space-y-4 pt-7">
          <input
            onChange={(e) => setRoomName(e.target.value)}
            className="rounded-md px-2 py-2 text-gray-500 placeholder:text-[1rem] button-border"
            placeholder="Room Name"
          />
        </div>

        <div className="pt-7 flex flex-col">
          <h3 className="text-2xl self-start">Number of players</h3>

          <div className="flex flex-wrap max-w-[21rem]">
            {[2, 3, 4, 5, 6].map((item) => (
              <button
                onClick={() => handleClick(item)}
                key={item}
                className={classNames(
                  "bg-white text-black px-6 py-1 button-border rounded-md mr-2 mt-2",
                  {
                    "bg-green-500 text-white": maxPlayers === item,
                  }
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-between pt-7">
          <div></div>
          <button
            onClick={handleConfirm}
            className="button-border p-2 w-[10rem] bg-green-700 hover:bg-green-600 rounded-full"
          >
            Confirm
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default CreateGame;
