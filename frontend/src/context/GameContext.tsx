import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { IGame, IPlayerMoveArgs } from "../types/types";
import { SocketContext } from "./SocketContext";
import { AnimationContext } from "./AnimationContext";
import { setGameState } from "../store/slices/game";
import cardSlide from "../assets/audio/cardSlide.wav";
import { AudioContext } from "./AudioContext";

const initialGameContextData: any = {};

export const GameContext = createContext(initialGameContextData);

type GameContextProviderProps = {
  children: ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const dispatch = useAppDispatch();
  const { socket } = useContext(SocketContext);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const { playAudio } = useContext(AudioContext);
  const {
    animateMoveChip,
    animateCardFlip,
    setActionAnimation,
    setAnimateFlop,
    animateCard,
    animateFlop,
  } = useContext(AnimationContext);

  const handlePreFlopUpdates = useCallback(
    ({ gameState, delay }: { gameState: IGame; delay: number }) => {
      let updatedGameState = { ...gameState };

      setTimeout(() => {
        gameState.players.forEach((player) => {
          animateCard(player.playerInfo.userId);
        });
      }, delay);

      const triggerMoveChipTime = gameState.players.length * 600 + delay;

      setTimeout(() => {
        const smallBlindPlayer = gameState.players.find((p) => p.isSmallBind);

        if (!smallBlindPlayer) return;

        animateMoveChip(smallBlindPlayer.playerInfo.userId);

        updatedGameState = {
          ...gameState,
          totalPot: updatedGameState.totalPot + smallBlindPlayer.playerPot,
        };

        dispatch(setGameState(updatedGameState));
      }, triggerMoveChipTime);

      setTimeout(() => {
        const bigBlindPlayer = gameState.players.find((p) => p.isBigBind);

        if (!bigBlindPlayer) return;

        animateMoveChip(bigBlindPlayer.playerInfo.userId);

        updatedGameState = {
          ...gameState,
          totalPot: updatedGameState.totalPot + bigBlindPlayer.playerPot,
        };

        dispatch(setGameState(updatedGameState));
      }, triggerMoveChipTime + 500);

      setTimeout(() => {
        if (!loggedUserInfo?.userId) return;

        const player = gameState.players.find(
          (p) => p.playerInfo.userId === loggedUserInfo?.userId
        );

        animateCardFlip(player);
      }, triggerMoveChipTime + 1000);

      updatedGameState = {
        ...gameState,
        totalPot: 0,
      };

      dispatch(setGameState(updatedGameState));
    },
    [
      animateCard,
      animateMoveChip,
      dispatch,
      loggedUserInfo?.userId,
      animateCardFlip,
    ]
  );

  const handleGameOverUpdates = useCallback(
    ({ gameState }: { gameState: IGame }) => {
      const updatedGameState = { ...gameState };

      if (gameState.draw.isDraw) {
        gameState.draw.potSpliters.forEach((player, index: number) => {
          const duration = 500 * index;
          setTimeout(() => {
            animateMoveChip(player.userId, true);
          }, duration);
        });

        gameState.players.forEach((player) => {
          animateCardFlip(player);
        });
      } else {
        animateMoveChip(gameState.winner.userId, true);
        gameState.players.forEach((player) => {
          animateCardFlip(player);
        });
      }

      dispatch(setGameState(updatedGameState));
    },
    [animateCardFlip, animateMoveChip, dispatch]
  );

  const handleUpdateGame = useCallback(
    ({ gameState, action, playerId }: IPlayerMoveArgs) => {
      if (!socket) return;

      if (gameState.winner || gameState.draw.isDraw) {
        return handleGameOverUpdates({ gameState });
      }

      if (gameState.currentRound === "preFlop" && !action) {
        return handlePreFlopUpdates({ gameState, delay: 0 });
      }

      if (gameState.currentRound === "flop" && !animateFlop) {
        playAudio(cardSlide);
        setAnimateFlop(true);
      }

      if (action === "fold" || action === "check") {
        setActionAnimation({ state: action, playerId });
      }

      if (action === "raise" || action === "call") {
        setActionAnimation({ state: action, playerId });
        animateMoveChip(playerId, false);
      }

      setTimeout(() => {
        setActionAnimation({ state: null, playerId: null });
      }, 1000);

      dispatch(setGameState(gameState));
    },
    [
      dispatch,
      animateMoveChip,
      handlePreFlopUpdates,
      setActionAnimation,
      socket,
      setAnimateFlop,
      playAudio,
      animateFlop,
      handleGameOverUpdates,
    ]
  );

  const contextValue: any = { handleUpdateGame, handlePreFlopUpdates };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
