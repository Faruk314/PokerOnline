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
    setAnimateTurn,
    setAnimateRiver,
    animateCard,
    animateFlop,
    animateTurn,
    animateRiver,
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

  const handleRunOutUpdates = useCallback(
    ({
      gameState: newGameState,
      previousRound,
    }: {
      gameState: IGame;
      previousRound: string;
    }) => {
      const WAIT_TIME = 2000;

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
            playAudio(cardSlide);
            setAnimateTurn(true);

            dispatch(
              updateGameState({
                communityCards: newGameState.communityCards.slice(0, 4),
              })
            );

            setTimeout(() => {
              playAudio(cardSlide);
              setAnimateRiver(true);

              dispatch(
                updateGameState({ communityCards: newGameState.communityCards })
              );
            }, WAIT_TIME);
          }, FLOP_ANIMATION_DURATION + WAIT_TIME);

          return FLOP_ANIMATION_DURATION + WAIT_TIME * 2;
        case "flop":
          setTimeout(() => {
            playAudio(cardSlide);
            setAnimateTurn(true);

            dispatch(
              updateGameState({
                communityCards: newGameState.communityCards.slice(0, 4),
              })
            );

            setTimeout(() => {
              playAudio(cardSlide);
              setAnimateRiver(true);

              dispatch(
                updateGameState({ communityCards: newGameState.communityCards })
              );
            }, WAIT_TIME);
          }, WAIT_TIME);
          return WAIT_TIME * 2;
        case "turn":
          setTimeout(() => {
            playAudio(cardSlide);
            setAnimateRiver(true);

            dispatch(
              updateGameState({ communityCards: newGameState.communityCards })
            );
          }, WAIT_TIME);
          return WAIT_TIME;

        default:
      }
    },
    [dispatch, playAudio, setAnimateFlop, setAnimateTurn, setAnimateRiver]
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
      const cleanedPlayers = gameState?.players.map((p, index) => ({
        ...p,
        cards: newGameState.players[index].cards,
        isFold: newGameState.players[index].isFold,
        playerPot: 0,
      }));

      dispatch(
        updateGameState({
          players: cleanedPlayers,
        })
      );

      const pots = newGameState.potInfo;

      if (!pots) return console.error("pots dont exist");

      let totalPot = Object.values(pots).reduce(
        (sum, pot) => sum + pot.amount,
        0
      );

      Object.entries(pots).forEach(([potId, pot], index) => {
        const amount = pot.amount;
        const ANIMATION_TRIGGER_DELAY = 2000 * index + 200;

        if (pot.isDraw) {
          pot.potSpliters?.forEach((player) => {
            setTimeout(() => {
              dispatch(
                updatePlayer({
                  playerId: player.userId,
                  data: { winInfo: { status: "draw", potName: potId } },
                })
              );

              animateMoveChip(player.userId, "tableToPlayer", potId);
            }, ANIMATION_TRIGGER_DELAY);

            setTimeout(() => {
              dispatch(
                updatePlayerCoins({
                  playerId: player.userId!,
                  amount: amount / pot.potSpliters!.length,
                })
              );
            }, CHIP_TO_PLAYER_ANIMATION_DURATION + ANIMATION_TRIGGER_DELAY);
          });

          setTimeout(() => {
            if (!gameState) return;

            totalPot -= amount;
            const newTotalPot = totalPot;

            dispatch(updateGameState({ totalPot: newTotalPot }));
          }, CHIP_TO_PLAYER_ANIMATION_DURATION + ANIMATION_TRIGGER_DELAY);
        } else {
          const winnerId = pot.winner?.userId;

          if (!winnerId) return console.error("winner does not exist");

          setTimeout(() => {
            dispatch(
              updatePlayer({
                playerId: winnerId,
                data: { winInfo: { status: "win", potName: potId } },
              })
            );
            animateMoveChip(winnerId, "tableToPlayer", potId);
          }, ANIMATION_TRIGGER_DELAY);

          setTimeout(() => {
            if (!gameState) return;

            totalPot -= amount;
            const newTotalPot = totalPot;

            dispatch(updateGameState({ totalPot: newTotalPot }));

            dispatch(
              updatePlayerCoins({
                playerId: winnerId!,
                amount,
              })
            );
          }, CHIP_TO_PLAYER_ANIMATION_DURATION + ANIMATION_TRIGGER_DELAY);
        }
      });
    },
    [animateMoveChip, dispatch, gameState]
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

      dispatch(
        updateGameState({
          playerTurn: undefined,
        })
      );

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
          newGameState.players.forEach((player) => {
            animateCardFlip(player);
          });

          dispatch(
            updateGameState({
              potInfo: newGameState.potInfo,
            })
          );

          return handleGameOverUpdates({
            gameState: newGameState,
          });
        } else {
          dispatch(setGameState(newGameState));
        }
      }, CHIP_TO_TABLE_ANIMATION_DURATION + 200);
    },
    [
      dispatch,
      frozenTablePotRef,
      handleGameOverUpdates,
      syncPlayerToTableChips,
      animateCardFlip,
    ]
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

      if (newGameState.currentRound === "preFlop" && !action) {
        frozenTablePotRef.current = 0;
        setAnimateFlop(false);
        setAnimateTurn(false);
        setAnimateRiver(false);
        return handlePreFlopUpdates({ gameState: newGameState, delay: 0 });
      }

      if (action && action.length) {
        if (
          action === "all in" ||
          action === "raise" ||
          action === "call" ||
          action === "bet"
        ) {
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

          newGameState.players.forEach((player) => {
            animateCardFlip(player);
          });

          dispatch(
            updateGameState({
              players: newGameState.players,
              potInfo: newGameState.potInfo,
            })
          );
        }, CHIP_TO_TABLE_ANIMATION_DURATION);

        const RUNOUT_DURATION = handleRunOutUpdates({
          gameState: newGameState,
          previousRound: previousRound,
        });

        return setTimeout(() => {
          handleGameOverUpdates({ gameState: newGameState });
        }, RUNOUT_DURATION);
      }

      if (newGameState.currentRound === "flop" && !animateFlop) {
        dispatch(
          updateGameState({ communityCards: newGameState.communityCards })
        );
        playAudio(cardSlide);
        setAnimateFlop(true);
      }

      if (newGameState.currentRound === "turn" && !animateTurn) {
        dispatch(
          updateGameState({ communityCards: newGameState.communityCards })
        );
        playAudio(cardSlide);
        setAnimateTurn(true);
      }

      if (newGameState.currentRound === "river" && !animateRiver) {
        dispatch(
          updateGameState({ communityCards: newGameState.communityCards })
        );

        playAudio(cardSlide);
        setAnimateRiver(true);
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
      animateCardFlip,
      animateRiver,
      setAnimateRiver,
      animateTurn,
      setAnimateTurn,
    ]
  );

  const handleNewPlayerJoin = useCallback(
    ({ gameState: newGameState }: { gameState: IGame }) => {
      dispatch(
        updateGameState({
          players: newGameState.players,
        })
      );
    },
    [dispatch]
  );

  const findCard = (index: number) => {
    const c = gameState?.communityCards?.[index];
    const card = pokerCards.find((card) => card.card === c);

    return (
      <div key={index} className="community-cards">
        <div className="absolute inset-0 rounded-sm border border-gray-400/60" />

        {card && (
          <div
            className={classNames("absolute inset-0 bg-white rounded-sm", {
              cardSlideOne: index === 1 && animateFlop,
              cardSlideTwo: index === 2 && animateFlop,
              cardSlideUp:
                (index === 3 && animateTurn) || (index === 4 && animateRiver),
            })}
          >
            <img
              src={card.image}
              className="h-full w-full rounded-sm object-cover"
            />
          </div>
        )}
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
    getRank,
    handleShowCards,
    onCardsShow,
    handleNewPlayerJoin,
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
