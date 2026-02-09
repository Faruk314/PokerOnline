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
  const { tablePotRef, frozenTablePotRef, registerTablePotRefs } =
    useContext(AnimationContext);
  const { findCard } = useContext(GameContext);
  const { gameState, isLoading, openRaiseBar, currentGameRoom } =
    useAppSelector((state) => state.game);
  const pots = Object.entries(gameState?.potInfo || []);

  const isCurrentPlayer =
    loggedUserInfo?.userId === gameState?.playerTurn?.playerInfo?.userId;

  useEffect(() => {
    dispatch(getGameState(id!));
  }, [dispatch, id]);

  return (
    <section className="game-page game-container bg-gradient-to-b from-gray-950 via-gray-900 to-black h-[100vh] w-full relative overflow-hidden">
      <Loader isLoading={isLoading} />
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header Section */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <div className="px-6 py-4 border-b border-white/10 bg-gradient-to-b from-gray-900/90 to-gray-950/90 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              {/* User Info */}
              <div className="flex-1">
                <UserInfo />
              </div>

              {/* Game Status */}
              <div className="hidden md:flex items-center gap-6 mr-8">
                {!gameState?.deck ? (
                  <div className="text-center">
                    <div className="text-xl font-bold text-white animate-pulse">
                      WAITING FOR PLAYERS
                    </div>
                    <div className="text-gray-400 text-sm">
                      {gameState?.players.length} /{currentGameRoom?.maxPlayers}{" "}
                      joined
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <div className="text-xl font-bold text-white">
                      {gameState?.currentRound?.toUpperCase() || "PREFLOP"}
                    </div>
                    <div className="text-gray-400 text-sm">Current Round</div>
                  </div>
                )}
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setOpenMenu((prev) => !prev)}
                  className="relative group px-4 py-3 rounded-xl bg-gradient-to-r from-gray-900/80 to-gray-950/80 backdrop-blur-sm border border-white/10 hover:border-yellow-500/30 transition-all duration-300"
                >
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500/10 to-amber-500/10 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <GiHamburgerMenu className="relative text-2xl text-gray-400 group-hover:text-yellow-400 transition-colors" />
                </button>

                {openMenu && <Menu />}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="relative z-0 pt-20">
        <TablePositions />

        <div className="table-size relative flex items-center justify-center rounded-full table-border">
          <img src={table} className="absolute w-full h-full rounded-full" />

          <div className="absolute top-[40%] xl:top-[30%] z-10 text-white font-bold flex items-center space-x-2 bg-[rgba(0,0,0,0.7)] lg:bg-[rgba(0,0,0,0.5)] rounded-full px-2">
            <span>TOTAL POT :</span>
            <span className="text-[0.9rem] md:text-[1rem] lg:py-[0.1rem]">
              {gameState?.totalPot && gameState?.totalPot}$
            </span>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="flex space-x-2">
              {[0, 1, 2, 3, 4].map((c, index) => {
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
            {pots.length === 0 && <ChipStack pot={frozenTablePotRef.current} />}

            {pots.length > 0 && (
              <div className="flex space-x-4">
                {pots.map(([potName, pot]) => (
                  <div
                    key={potName}
                    ref={(el) => registerTablePotRefs(potName, el)}
                  >
                    <ChipStack pot={pot.amount} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Controls */}
      {isCurrentPlayer && (
        <div className="fixed text-white font-bold text-2xl flex space-x-2 lg:space-x-4 right-1 bottom-1 lg:right-5 lg:bottom-5 z-20 w-[480px]">
          {!openRaiseBar && <Buttons />}
          {openRaiseBar && <RaiseBar />}
        </div>
      )}

      {/* Show Cards Button */}
      <div className="fixed right-6 bottom-6 z-30">
        <ShowCardsBtn />
      </div>
    </section>
  );
};

export default Game;
