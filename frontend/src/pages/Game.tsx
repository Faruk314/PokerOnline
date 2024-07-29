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
import { IPlayer } from "../types/types";
import { SocketContext } from "../context/SocketContext";
import { pokerCards } from "../utils/cards";
import classNames from "classnames";
import Player from "../components/Player";
import { AnimationContext } from "../context/AnimationContext";

const Game = () => {
  const positions = [
    "bottomCenter",
    "bottomLeft",
    "left",
    "topLeft",
    "topCenter",
    "topRight",
    "right",
    "bottomRight",
  ];
  const { socket } = useContext(SocketContext);
  const [openMenu, setOpenMenu] = useState(false);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { gameState, isLoading } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { tablePotRef, animateFlop } = useContext(AnimationContext);

  useEffect(() => {
    dispatch(getGameState(id));
  }, [dispatch, id]);

  useEffect(() => {
    socket?.on("connect", () => {
      if (id) {
        socket?.emit("reconnectToRoom", id);
      }
    });
  }, [id, socket]);

  const determineTablePositions = () => {
    if (!gameState) return;

    const loggedUserInfoIndex = gameState.players.findIndex(
      (player) => player.playerInfo.userId === loggedUserInfo?.userId
    );

    const players = gameState.players;

    const user = players[loggedUserInfoIndex];

    const tablePositions: IPlayer[] = [];

    tablePositions.push(user);

    for (let i = loggedUserInfoIndex + 1; i < players.length; i++) {
      tablePositions.push(players[i]);
    }

    for (let i = 0; i < loggedUserInfoIndex; i++) {
      tablePositions.push(players[i]);
    }

    return tablePositions;
  };

  const findCard = (c: string, index: number) => {
    const card = pokerCards.find((card) => card.card === c);

    return (
      <div
        key={c}
        className={classNames("w-[4rem]", {
          cardSlideOne: index === 1 && animateFlop,
          cardSlideTwo: index === 2 && animateFlop,
        })}
      >
        <div className="h-full bg-white w-full rounded-md">
          <img src={card?.image} className="h-full rounded-md" />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="flex items-center justify-center bg-gray-800 h-[100vh] w-full">
      <div className="fixed top-4 px-4 flex w-full justify-between items-start">
        <UserInfo />

        <div className="relative">
          <div className="button-border flex rounded-md h-max text-xl">
            <button
              onClick={() => setOpenMenu((prev) => !prev)}
              className="text-white p-2"
            >
              <GiHamburgerMenu />
            </button>
          </div>

          {openMenu && <Menu />}
        </div>
      </div>

      <div className="relative">
        {determineTablePositions()?.map((player, index) => {
          return (
            <Player
              key={player.playerInfo.userId}
              player={player}
              position={positions[index]}
            />
          );
        })}

        <div className="relative flex items-center justify-center h-[33rem] rounded-full w-[60rem] styled-border">
          <img src={table} className="absolute w-full h-full rounded-full" />

          <div className="absolute top-[30%] text-white font-bold flex items-center space-x-2 bg-[rgba(0,0,0,0.5)] py-[0.1rem] rounded-full px-1">
            <img
              ref={tablePotRef}
              src={chip}
              className="w-[1.2rem] h-[1.2rem]"
            />
            <span>{gameState?.totalPot}</span>
          </div>

          <div className="relative flex flex-col items-center">
            <div className="flex space-x-2 w-[22rem]">
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
