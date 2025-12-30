import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  GameStateRollbackParams,
  IActionAnimation,
  IGame,
  IPlayerMoveArgs,
} from "../types/types";
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
import chipPlaceSound from "../assets/audio/chipPlace.mp3";

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

  const ACTION_ANIMATION_DURATION = 1000;
  const CHIP_TO_TABLE_ANIMATION_DURATION = 600;
  const CHIP_TO_PLAYER_ANIMATION_DURATION = 600;
  const FLOP_ANIMATION_DURATION = 1000;

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

  const onCardsShow = useCallback(
    ({ playerId, cards }: { playerId: string; cards: string[] }) => {
      dispatch(
        updatePlayer({ playerId, data: { cards: cards, showCards: true } })
      );
    },
    [dispatch]
  );

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

  const handleRunOutUpdates = useCallback(
    ({
      gameState: newGameState,
      previousRound,
    }: {
      gameState: IGame;
      previousRound: string;
    }) => {
      const WAIT_TIME = 1000;

      switch (previousRound) {
        case "preFlop":
          playAudio(cardSlide);
          setAnimateFlop(true);

          dispatch(
            updateGameState({
              communityCards: newGameState.communityCards.slice(0, 3),
            })
          );

          setTimeout(() => {
            dispatch(
              updateGameState({
                communityCards: newGameState.communityCards.slice(0, 4),
              })
            );

            setTimeout(() => {
              dispatch(
                updateGameState({ communityCards: newGameState.communityCards })
              );
            }, WAIT_TIME);
          }, FLOP_ANIMATION_DURATION + WAIT_TIME);

          return FLOP_ANIMATION_DURATION + WAIT_TIME * 2;
        case "flop":
          setTimeout(() => {
            dispatch(
              updateGameState({
                communityCards: newGameState.communityCards.slice(0, 4),
              })
            );

            setTimeout(() => {
              dispatch(
                updateGameState({ communityCards: newGameState.communityCards })
              );
            }, WAIT_TIME);
          }, WAIT_TIME);
          return WAIT_TIME * 2;
        case "turn":
          setTimeout(() => {
            dispatch(
              updateGameState({ communityCards: newGameState.communityCards })
            );
          }, WAIT_TIME);
          return WAIT_TIME;

        default:
      }
    },
    [dispatch, playAudio, setAnimateFlop]
  );

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
      const cleanedPlayers = newGameState.players.map((p) => ({
        ...p,
        playerPot: 0,
      }));

      dispatch(
        updateGameState({
          potInfo: newGameState.potInfo,
          players: cleanedPlayers,
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

  const syncPlayerToTableChips = useCallback(
    ({
      playerId: prevPlayerId,
      previousTotalPot,
      previousPlayerPot,
      gameState: newGameState,
    }: GameStateRollbackParams) => {
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
    },
    [animateMoveChip, dispatch]
  );

  const handleRoundOverUpdates = useCallback(
    ({
      gameState: newGameState,
      playerId: prevPlayerId,
      previousPlayerPot,
      previousTotalPot,
    }: GameStateRollbackParams) => {
      syncPlayerToTableChips({
        playerId: prevPlayerId,
        previousPlayerPot,
        previousTotalPot,
        gameState: newGameState,
      });

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
    },
    [dispatch, frozenTablePotRef, handleGameOverUpdates, syncPlayerToTableChips]
  );

  const handleUpdateGame = useCallback(
    ({
      gameState: newGameState,
      action,
      playerId: prevPlayerId,
      previousPlayerPot,
      previousTotalPot,
      previousRound,
    }: IPlayerMoveArgs) => {
      if (!socket) return;

      if (action && action.length) {
        if (action === "all in" || action === "raise" || action === "call") {
          playAudio(chipPlaceSound);
        }

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

      if (newGameState.isGameOver && action === "fold") {
        return handleRoundOverUpdates({
          gameState: newGameState,
          playerId: prevPlayerId,
          previousPlayerPot,
          previousTotalPot,
        });
      }

      if (
        newGameState.isGameOver &&
        previousRound !== "showdown" &&
        previousRound !== "river"
      ) {
        syncPlayerToTableChips({
          playerId: prevPlayerId,
          previousPlayerPot,
          previousTotalPot,
          gameState: newGameState,
        });

        setTimeout(() => {
          frozenTablePotRef.current = previousTotalPot;

          dispatch(updateGameState({ players: newGameState.players }));
        }, CHIP_TO_TABLE_ANIMATION_DURATION);

        const RUNOUT_DURATION = handleRunOutUpdates({
          gameState: newGameState,
          previousRound: previousRound,
        });

        return setTimeout(() => {
          handleGameOverUpdates({ gameState: newGameState });
        }, RUNOUT_DURATION);
      }

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
        return handleRoundOverUpdates({
          gameState: newGameState,
          playerId: prevPlayerId,
          previousPlayerPot,
          previousTotalPot,
        });
      } else {
        dispatch(setGameState(newGameState));
      }
    },
    [
      dispatch,
      handlePreFlopUpdates,
      handleRunOutUpdates,
      handleRoundOverUpdates,
      setAnimationMap,
      socket,
      setAnimateFlop,
      playAudio,
      animateFlop,
      syncPlayerToTableChips,
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
    onCardsShow,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
