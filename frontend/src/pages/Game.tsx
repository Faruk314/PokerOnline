import { useContext, useEffect, useState } from "react";
import table from "../assets/images/table.jpg";
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
import Buttons from "../components/Buttons";
import RaiseBar from "../components/RaiseBar";
import ShowCardsBtn from "../components/ShowCardsBtn";
import ChipStack from "../components/ChipStack";
import classNames from "classnames";

const Game = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { tablePotRef, frozenTablePotRef } = useContext(AnimationContext);
  const { findCard } = useContext(GameContext);
  const { gameState, isLoading, openRaiseBar } = useAppSelector(
    (state) => state.game
  );
  const isCurrentPlayer =
    loggedUserInfo?.userId === gameState?.playerTurn?.playerInfo.userId;

  useEffect(() => {
    dispatch(getGameState(id!));
  }, [dispatch, id]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="game-page game-container bg-gray-800 h-[100vh] w-full">
      <p className="fixed top-4 text-white font-black text-2xl">
        Waiting for other players...
      </p>

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

          <div className="absolute top-[40%] xl:top-[30%] z-10 text-white font-bold flex items-center space-x-2 bg-[rgba(0,0,0,0.7)] lg:bg-[rgba(0,0,0,0.5)] rounded-full px-2">
            <span>TOTAL POT :</span>
            <span className="text-[0.9rem] md:text-[1rem] lg:py-[0.1rem]">
              {gameState?.totalPot}$
            </span>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="flex space-x-2">
              {gameState?.communityCards.map((c, index) => {
                return findCard(c, index);
              })}
            </div>
          </div>

          <div
            ref={tablePotRef}
            className={classNames("absolute bottom-[7rem]", {
              invisible: gameState?.currentRound === "preflop",
            })}
          >
            <ChipStack pot={frozenTablePotRef.current} />
          </div>
        </div>
      </div>

      {isCurrentPlayer && (
        <div className="fixed text-white font-bold text-2xl flex space-x-2 lg:space-x-4 right-1 bottom-1 lg:right-5 lg:bottom-5">
          {!openRaiseBar && <Buttons />}

          {openRaiseBar && <RaiseBar />}
        </div>
      )}

      <div className="fixed text-white font-bold text-2xl flex space-x-2 lg:space-x-4 right-1 bottom-1 lg:right-5 lg:bottom-5">
        <ShowCardsBtn />
      </div>
    </section>
  );
};

export default Game;
