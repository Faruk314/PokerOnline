import React, { useContext, useEffect, useState } from "react";
import { useRef } from "react";
import { IoClose } from "react-icons/io5";
import Wrapper from "./Wrapper";
import { SocketContext } from "../context/SocketContext";
import classNames from "classnames";
import { toast } from "react-toastify";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import chipSM from "../assets/images/chip.png";

interface Props {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const CreateGame = ({ setOpenModal }: Props) => {
  const [roomSettings, setRoomSettings] = useState({
    maxPlayers: null as number | null,
    minStake: 500,
    roomName: "",
  });
  const [openDropdown, setOpenDropDown] = useState(false);
  const { socket } = useContext(SocketContext);
  const modalRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const stakes = [500, 1000, 10000, 50000, 100000, 500000, 1000000];
  const playerNums = [2, 3, 4, 5, 6];

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropDown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, [modalRef]);

  const handleConfirm = () => {
    if (roomSettings.roomName.length === 0) {
      return toast.error("Please enter a room name");
    }

    if (roomSettings.maxPlayers === null) {
      return toast.error("Please add max number of players");
    }

    if (!socket)
      return console.log("Socket does not exist in create game component");

    socket.emit("createRoom", roomSettings);

    setOpenModal(false);
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
    <Wrapper setOpenModal={setOpenModal} modalRef={modalRef}>
      <div
        ref={modalRef}
        className="relative z-40 w-[21rem] md:w-[30rem] p-4 md:p-6 space-y-4 bg-gray-800 rounded-md button-border"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-2xl">Create Game</h2>
          <button onClick={() => setOpenModal(false)} className="text-3xl">
            <IoClose />
          </button>
        </div>

        <div className="flex flex-col space-y-4 pt-7">
          <input
            onChange={(e) => handleChange("roomName", e.target.value)}
            className="rounded-md px-2 py-2 text-gray-500 placeholder:text-[0.9rem] md:placeholder:text-[1rem] button-border"
            placeholder="Room Name"
          />
        </div>

        <div className="relative">
          <button
            onClick={handleDropdownClick}
            className="rounded-md px-2 py-2 flex items-center justify-between w-full cursor-pointer bg-white text-gray-400 text-[0.9rem] md:text-[1rem] button-border"
          >
            {roomSettings.minStake === 500 ? (
              <div className="flex space-x-1 items-center">
                <span>minimal stake</span>
                <div className="flex space-x-1 items-center">
                  <span> {roomSettings.minStake}</span>
                  <img src={chipSM} className="h-[1rem]" />
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-1">
                <span>{roomSettings.minStake}</span>
                <img src={chipSM} className="h-[1rem]" />
              </div>
            )}

            <div className="text-black text-2xl">
              {openDropdown ? <MdKeyboardArrowUp /> : <MdKeyboardArrowDown />}
            </div>
          </button>

          {openDropdown && (
            <div
              ref={dropdownRef}
              className="absolute top-[4rem] bg-white text-black flex items-center flex-col w-[70%]"
            >
              {stakes.map((stake) => (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick("minStake", stake);
                    setOpenDropDown(false);
                  }}
                  className="px-2 py-1 flex items-center space-x-1 hover:bg-gray-300 border-b last:border-0 w-full"
                  key={stake}
                >
                  <img src={chipSM} className="h-[1.2rem]" />
                  <span>{stake}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="pt-7 flex flex-col">
          <h3 className="text-2xl self-start">Number of players</h3>

          <div className="flex flex-wrap max-w-[21rem]">
            {playerNums.map((item) => (
              <button
                onClick={() => handleClick("maxPlayers", item)}
                key={item}
                className={classNames(
                  "bg-white text-black px-4 md:px-6 py-1 button-border rounded-md mr-2 mt-2",
                  {
                    "bg-red-500 text-white": roomSettings.maxPlayers === item,
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
            className="button-border p-2 w-[10rem] bg-green-600 hover:bg-green-500 rounded-full"
          >
            Confirm
          </button>
        </div>
      </div>
    </Wrapper>
  );
};

export default CreateGame;
