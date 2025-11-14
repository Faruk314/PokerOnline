import { useContext, useEffect, useState } from "react";
import table from "../assets/images/table.jpg";
import chip from "../assets/images/chip.png";
import { GiHamburgerMenu } from "react-icons/gi";
import Menu from "../modals/Menu";
import UserInfo from "../components/UserInfo";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { getGameState } from "../store/slices/game";
import Loader from "../components/Loader";
import { useParams } from "react-router-dom";
import { AnimationContext } from "../context/AnimationContext";
import { GameContext } from "../context/GameContext";
import TablePositions from "../components/TablePositions";

const Game = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { gameState, isLoading } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { tablePotRef } = useContext(AnimationContext);
  const { findCard } = useContext(GameContext);

  useEffect(() => {
    dispatch(getGameState(id!));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="game-page game-container bg-gray-800 h-[100vh] w-full">
      {!gameState && (
        <p className="fixed top-4 text-white font-black text-2xl">
          Waiting for other players...
        </p>
      )}
      <div className="fixed top-4 px-4 flex w-full justify-between items-start">
        <UserInfo />

        <div className="relative">
          <div className="button-border flex rounded-md h-max text-xl">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="text-white p-1 lg:p-2"
            >
              <GiHamburgerMenu />
            </button>
          </div>

          {openMenu && <Menu />}
        </div>
      </div>

      <div className="relative">
        <TablePositions />

        <div className="table-size relative flex items-center justify-center rounded-full table-border">
          <img src={table} className="absolute w-full h-full rounded-full" />

          <div className="absolute top-[40%] xl:top-[30%] z-10 text-white font-bold flex items-center space-x-2 bg-[rgba(0,0,0,0.7)] lg:bg-[rgba(0,0,0,0.5)] rounded-full px-1">
            <img ref={tablePotRef} src={chip} className="chip" />
            <span className="text-[0.9rem] md:text-[1rem] lg:py-[0.1rem]">
              {gameState?.totalPot}
            </span>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="flex space-x-2">
              {gameState?.communityCards.map((c, index) => {
                return findCard(c, index);
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;
