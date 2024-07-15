import { useContext, useEffect, useState } from "react";
import table from "../assets/images/table.jpg";
import PlayerInfo from "../components/PlayerInfo";
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
    const currentRound = gameState?.currentRound;

    return (
      <div
        key={c}
        className={classNames("w-[4rem]", {
          cardSlideOne: index === 1 && currentRound === "flop",
          cardSlideTwo: index === 2 && currentRound === "flop",
        })}
      >
        <div className="h-full bg-white w-full rounded-md">
          <img src={card?.image} className="h-full rounded-md" />
        </div>
      </div>
    );
  };

  const renderButtons = () => {
    const lastBet = gameState?.lastBet;
    let callAmount = gameState?.lastBet;
    const isRaised = gameState?.players.some(
      (player) => player.playerRaise.isRaise
    );
    const round = gameState?.currentRound;

    if (gameState?.playerTurn.isSmallBind && !isRaised && round === "preFlop") {
      callAmount = gameState.lastBet / 2;
    }

    if (lastBet && lastBet > 0 && callAmount)
      return (
        <button
          onClick={() => handleCall(callAmount)}
          className="button-border flex space-x-3 items-center bg-gray-900 px-8 py-2 hover:bg-gray-800 rounded-full"
        >
          <span>CALL</span>
          <div className="flex items-center space-x-1">
            <span>{callAmount}</span>
            <img src={chip} className="w-4 h-4" />
          </div>
        </button>
      );

    // return (
    //   <button
    //     onClick={handleCheck}
    //     className="button-border flex space-x-3 items-center bg-gray-900 px-8 py-2 hover:bg-gray-800 rounded-full"
    //   >
    //     <span>CHECK</span>
    //   </button>
    // );
  };

  const handleCall = (amount: number) => {
    socket?.emit("playerCall", { roomId: id, amount });
  };

  const handleCheck = () => {
    socket?.emit("playerCheck", { roomId: id });
  };

  const handleFold = () => {
    socket?.emit("playerFold", { roomId: id });
  };

  const handleRaise = (amount: number) => {
    socket?.emit("playerRaise", { roomId: id, amount });
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

      {gameState?.playerTurn?.playerInfo.userId === loggedUserInfo?.userId && (
        <div className="fixed text-white font-bold text-2xl flex space-x-4 right-10 bottom-10">
          <button
            onClick={handleFold}
            className="button-border bg-gray-900 px-8 py-2 bg-red-700 hover:bg-red-600 rounded-full"
          >
            FOLD
          </button>
          {renderButtons()}
          <button
            onClick={() => handleRaise(1000)}
            className="button-border bg-gray-900 px-8 py-2 bg-green-700 hover:bg-green-600 rounded-full"
          >
            RAISE
          </button>
        </div>
      )}
      <div className="relative">
        {determineTablePositions()?.map((player, index) => {
          return (
            <PlayerInfo
              key={player.playerInfo.userId}
              player={player}
              position={positions[index]}
            />
          );
        })}

        <div className="relative flex items-center justify-center h-[33rem] rounded-full w-[60rem] styled-border">
          <img src={table} className="absolute w-full h-full rounded-full" />

          <div className="relative flex flex-col items-center">
            <div className="relative top-[-1rem] text-white font-bold flex items-center space-x-2 bg-[rgba(0,0,0,0.5)] py-[0.1rem] rounded-full px-1">
              <img src={chip} className="w-5 h-5" />
              <span>{gameState?.totalPot}</span>
            </div>
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
