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

import { pokerCards } from "../utils/cards";
import classNames from "classnames";
import Player from "../components/Player";
import { AnimationContext } from "../context/AnimationContext";

const Game = () => {
  const [openMenu, setOpenMenu] = useState(false);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { gameState, isLoading } = useAppSelector((state) => state.game);
  const dispatch = useAppDispatch();
  const { id } = useParams<{ id: string }>();
  const { tablePotRef, animateFlop } = useContext(AnimationContext);
  // const communityCards = ["H10", "H10", "H10", "H10"];

  useEffect(() => {
    dispatch(getGameState(id!));
  }, [dispatch, id]);

  const getTablePositions = () => {
    if (!gameState) return null;

    const tablePositions = gameState?.tablePositions;

    if (!tablePositions) return null;

    if (!loggedUserInfo?.userId) return null;

    const userTablePositions = tablePositions[loggedUserInfo.userId];

    if (!userTablePositions) return null;

    return Object.entries(userTablePositions).map(([key, value]) => {
      const playerData = gameState?.players.find(
        (p) => p.playerInfo.userId === parseInt(key)
      );

      if (typeof value !== "string" || !playerData) return null;

      return <Player key={key} player={playerData} position={value} />;
    });
  };

  // const players = [
  //   {
  //     coins: 5000,
  //     playerInfo: { userId: 1, userName: "Player1", position: "bottomCenter" },
  //     isDealer: true,
  //     isSmallBind: false,
  //     isBigBind: false,
  //     cards: ["AS", "KH"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 0,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  //   {
  //     coins: 4500,
  //     playerInfo: { userId: 2, userName: "Player2", position: "bottomLeft" },
  //     isDealer: false,
  //     isSmallBind: true,
  //     isBigBind: false,
  //     cards: ["2C", "3D"],
  //     isAllIn: false,
  //     isFold: true,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 50,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  //   {
  //     coins: 4000,
  //     playerInfo: { userId: 3, userName: "Player3", position: "left" },
  //     isDealer: false,
  //     isSmallBind: false,
  //     isBigBind: true,
  //     cards: ["5H", "7S"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 100,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  //   {
  //     coins: 6000,
  //     playerInfo: { userId: 4, userName: "Player4", position: "topLeft" },
  //     isDealer: false,
  //     isSmallBind: false,
  //     isBigBind: false,
  //     cards: ["QC", "JD"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 0,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  //   {
  //     coins: 3000,
  //     playerInfo: { userId: 5, userName: "Player5", position: "topCenter" },
  //     isDealer: false,
  //     isSmallBind: false,
  //     isBigBind: false,
  //     cards: ["9S", "10H"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 0,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  //   {
  //     coins: 3500,
  //     playerInfo: { userId: 6, userName: "Player6", position: "topRight" },
  //     isDealer: false,
  //     isSmallBind: false,
  //     isBigBind: false,
  //     cards: ["8D", "6C"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 0,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },

  //   {
  //     coins: 3500,
  //     playerInfo: { userId: 7, userName: "Player7", position: "right" },
  //     isDealer: false,
  //     isSmallBind: false,
  //     isBigBind: false,
  //     cards: ["8D", "6C"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 0,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  //   {
  //     coins: 3500,
  //     playerInfo: { userId: 8, userName: "Player8", position: "bottomRight" },
  //     isDealer: false,
  //     isSmallBind: false,
  //     isBigBind: false,
  //     cards: ["8D", "6C"],
  //     isAllIn: false,
  //     isFold: false,
  //     isCall: false,
  //     isCheck: false,
  //     playerPot: 0,
  //     playerRaise: { amount: 0, isRaise: false },
  //     hand: null,
  //     time: null,
  //   },
  // ];

  const findCard = (c: string, index: number) => {
    const card = pokerCards.find((card) => card.card === c);

    return (
      <div
        key={c}
        className={classNames("community-cards", {
          cardSlideOne: index === 1 && animateFlop,
          cardSlideTwo: index === 2 && animateFlop,
        })}
      >
        <div className="h-full bg-white w-full rounded-sm">
          <img src={card?.image} className="h-full rounded-md" />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="game-page game-container bg-gray-800 h-[100vh] w-full">
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
        {getTablePositions()}

        {/* {players.map((player) => (
          <Player
            key={player.playerInfo.userId}
            player={player}
            position={player.playerInfo.position}
          />
        ))} */}

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

              {/* {communityCards.map((c, index) => {
                return findCard(c, index);
              })} */}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Game;
