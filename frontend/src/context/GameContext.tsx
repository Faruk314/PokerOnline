import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { IActionAnimation, IGame, IPlayerMoveArgs } from "../types/types";
import { SocketContext } from "./SocketContext";
import { AnimationContext } from "./AnimationContext";
import {
  setGameState,
  updateGameState,
  updatePlayer,
  updatePlayerCoins,
} from "../store/slices/game";
import cardSlide from "../assets/audio/cardSlide.wav";
import { AudioContext } from "./AudioContext";
import HandName from "../components/HandName";
import pokerCards from "../utils/cards";
import classNames from "classnames";

const initialGameContextData: any = {};

export const GameContext = createContext(initialGameContextData);

type GameContextProviderProps = {
  children: ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { gameState } = useAppSelector((state) => state.game);
  const { playAudio } = useContext(AudioContext);
  const {
    animateMoveChip,
    animateCardFlip,
    setAnimateFlop,
    animateCard,
    animateFlop,
    setAnimationMap,
    frozenTablePotRef,
  } = useContext(AnimationContext);

  const handleRaise = (amount: number, roomId: string) => {
    socket?.emit("playerRaise", { roomId, amount });
  };

  const handleCall = (amount: number, roomId: string) => {
    socket?.emit("playerCall", { roomId, amount });
  };

  const handleFold = (roomId: string) => {
    socket?.emit("playerFold", { roomId });
  };

  const handleCheck = (roomId: string) => {
    socket?.emit("playerCheck", { roomId });
  };

  const getRank = (rank: number) => {
    if (rank === 11) {
      return "J";
    }

    if (rank === 12) {
      return "Q";
    }

    if (rank === 13) {
      return "K";
    }

    if (rank === 14) {
      return "A";
    }

    return rank.toString();
  };

  const findPotSpliter = (playerId: string) => {
    const potSpliter = gameState?.potInfo["mainPot"].potSpliters!.find(
      (p) => p.userId === playerId
    );

    if (!potSpliter) return null;

    return (
      <div className="absolute flex items-center flex-col top-[-4rem] text-yellow-400 text-4xl font-bold z-40">
        <span>DRAW</span>
        <HandName hand={potSpliter.hand} />
      </div>
    );
  };

  const handlePreFlopUpdates = useCallback(
    ({ gameState, delay }: { gameState: IGame; delay: number }) => {
      const STAGER = 400;
      const ANIMATION_DURATION = delay * gameState.players.length;

      setTimeout(() => {
        gameState.players.forEach((player) => {
          animateCard(player.playerInfo.userId);
        });
      }, delay);

      const flipDelay =
        delay + gameState.players.length * STAGER + ANIMATION_DURATION;

      setTimeout(() => {
        if (!loggedUserInfo?.userId) return;

        const player = gameState.players.find(
          (p) => p.playerInfo.userId === loggedUserInfo?.userId
        );

        if (player) {
          animateCardFlip(player);
        }
      }, flipDelay);

      dispatch(setGameState(gameState));
    },
    [animateCard, dispatch, loggedUserInfo?.userId, animateCardFlip]
  );

  const handleGameOverUpdates = useCallback(
    ({ gameState: newGameState }: { gameState: IGame }) => {
      const CHIP_TO_PLAYER_ANIMATION_DURATION = 600;

      dispatch(
        updateGameState({
          potInfo: newGameState.potInfo,
          players: newGameState.players,
        })
      );

      const mainPot = newGameState.potInfo["mainPot"];

      if (mainPot.isDraw) {
        const amount = newGameState.potInfo["mainPot"].amount;

        mainPot.potSpliters!.forEach((player) => {
          setTimeout(() => {
            animateMoveChip(player.userId, "tableToPlayer");
          }, 200);

          setTimeout(() => {
            dispatch(
              updatePlayerCoins({
                playerId: player.userId!,
                amount: amount / mainPot.potSpliters!.length,
              })
            );
          }, CHIP_TO_PLAYER_ANIMATION_DURATION);
        });

        newGameState.players.forEach((player) => {
          animateCardFlip(player);
        });
      } else {
        const winnerId = mainPot.winner?.userId;
        const amount = mainPot.amount;

        setTimeout(() => {
          animateMoveChip(winnerId, "tableToPlayer");
        }, 200);

        setTimeout(() => {
          dispatch(updateGameState({ totalPot: newGameState.totalPot }));
          dispatch(
            updatePlayerCoins({
              playerId: winnerId!,
              amount,
            })
          );
        }, CHIP_TO_PLAYER_ANIMATION_DURATION);

        newGameState.players.forEach((player) => {
          animateCardFlip(player);
        });
      }
    },
    [animateCardFlip, animateMoveChip, dispatch]
  );

  const handleUpdateGame = useCallback(
    ({
      gameState: newGameState,
      action,
      playerId: prevPlayerId,
      previousPlayerPot,
      previousTotalPot,
    }: IPlayerMoveArgs) => {
      if (!socket) return;

      const ACTION_ANIMATION_DURATION = 1000;
      const CHIP_TO_TABLE_ANIMATION_DURATION = 600;

      if (action && action.length) {
        setAnimationMap((prevState: Map<string, IActionAnimation>) => {
          const newMap = new Map(prevState);
          newMap.set(prevPlayerId, { state: action });
          return newMap;
        });
      }

      setTimeout(() => {
        setAnimationMap((prevState: Map<string, IActionAnimation>) => {
          const newMap = new Map(prevState);
          newMap.delete(prevPlayerId);
          return newMap;
        });
      }, ACTION_ANIMATION_DURATION);

      if (newGameState.currentRound === "preFlop" && !action) {
        return handlePreFlopUpdates({ gameState: newGameState, delay: 0 });
      }

      if (newGameState.currentRound === "flop" && !animateFlop) {
        dispatch(
          updateGameState({ communityCards: newGameState.communityCards })
        );
        playAudio(cardSlide);
        setAnimateFlop(true);
      }

      if (newGameState.lastMaxBet === 0) {
        dispatch(
          updatePlayer({
            playerId: prevPlayerId,
            data: { playerPot: previousPlayerPot },
          })
        );

        dispatch(updateGameState({ playerTurn: undefined }));

        setTimeout(() => {
          newGameState.players.forEach((p) => {
            animateMoveChip(p.playerInfo.userId, "playerToTable");
          });

          if (newGameState.isGameOver) {
            dispatch(updateGameState({ totalPot: previousTotalPot }));
          }
        }, 200);

        setTimeout(() => {
          frozenTablePotRef.current = previousTotalPot;

          if (newGameState.isGameOver) {
            return handleGameOverUpdates({
              gameState: newGameState,
            });
          } else {
            dispatch(setGameState(newGameState));
          }
        }, CHIP_TO_TABLE_ANIMATION_DURATION + 200);
      } else {
        dispatch(setGameState(newGameState));
      }
    },
    [
      dispatch,
      animateMoveChip,
      handlePreFlopUpdates,
      setAnimationMap,
      socket,
      setAnimateFlop,
      playAudio,
      animateFlop,
      handleGameOverUpdates,
      frozenTablePotRef,
    ]
  );

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

  const handleShowCards = (roomId: string) => {
    socket?.emit("playerShowCards", { roomId });
  };

  const contextValue: any = {
    handleUpdateGame,
    handlePreFlopUpdates,
    findCard,
    handleRaise,
    handleFold,
    handleCheck,
    handleCall,
    findPotSpliter,
    getRank,
    handleShowCards,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
