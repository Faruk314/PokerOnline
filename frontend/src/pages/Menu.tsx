import { useContext, useEffect, useState } from "react";
import { AudioContext } from "../context/AudioContext";
import UserInfo from "../components/UserInfo";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import CreateGame from "../modals/CreateGame";
import JoinGame from "../modals/JoinGame";
import Logo from "../components/Logo";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logout, reset } from "../store/slices/auth";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Shop from "../modals/Shop";

const Menu = () => {
  const [openCreateGame, setOpenCreateGame] = useState(false);
  const [openJoinGame, setOpenJoinGame] = useState(false);
  const [openShop, setOpenShop] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { volumeOn, handleVolume } = useContext(AudioContext);
  const { isLoading, isError, isSuccess } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error("There was a problem while logging out");
    }

    if (isSuccess) {
      navigate("/");
    }

    dispatch(reset());
  }, [isError, isSuccess, dispatch, navigate]);

  const handleExit = () => {
    dispatch(logout());
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="bg-gray-800 flex items-center justify-center text-xl font-bold h-[100vh] w-full text-white">
      <div className="fixed flex items-start justify-between top-0 px-4 py-4 w-full">
        <UserInfo />
        <button
          onClick={handleVolume}
          className="button-border flex rounded-md p-2 h-max text-xl"
        >
          {volumeOn ? <FaVolumeUp /> : <FaVolumeMute />}
        </button>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <Logo />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenCreateGame(true);
          }}
          className="button-border p-4 w-[15rem] hover:bg-gray-700 rounded-full"
        >
          Create Game
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenJoinGame(true);
          }}
          className="button-border p-4 w-[15rem] hover:bg-gray-700 rounded-full"
        >
          Join Game
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setOpenShop(true);
          }}
          className="button-border p-4 w-[15rem] bg-green-600 hover:bg-green-500 rounded-full"
        >
          Shop
        </button>

        <button
          onClick={handleExit}
          className="button-border p-4 w-[15rem] bg-red-700 hover:bg-red-600 rounded-full"
        >
          Exit
        </button>
      </div>

      {openCreateGame && <CreateGame setOpenModal={setOpenCreateGame} />}
      {openJoinGame && <JoinGame setOpenModal={setOpenJoinGame} />}
      {openShop && <Shop setOpenModal={setOpenShop} />}
    </section>
  );
};

export default Menu;
