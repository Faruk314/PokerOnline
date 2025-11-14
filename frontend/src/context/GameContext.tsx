import { createContext, ReactNode, useCallback, useContext } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { IActionAnimation, IGame, IPlayerMoveArgs } from "../types/types";
import { SocketContext } from "./SocketContext";
import { AnimationContext } from "./AnimationContext";
import { setGameState } from "../store/slices/game";
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

      if (gameState.potInfo["mainPot"].isDraw) {
        gameState.potInfo["mainPot"].potSpliters!.forEach(
          (player, index: number) => {
            const duration = 500 * index;
            setTimeout(() => {
              animateMoveChip(player.userId, true);
            }, duration);
          }
        );

        gameState.players.forEach((player) => {
          animateCardFlip(player);
        });
      } else {
        animateMoveChip(gameState.potInfo["mainPot"].winner!.userId, true);
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

      if (action === "raise" || action === "call" || action === "all in") {
        animateMoveChip(playerId, false);
      }

      if (action && action.length) {
        setAnimationMap((prevState: Map<string, IActionAnimation>) => {
          const newMap = new Map(prevState);
          newMap.set(playerId, { state: action });
          return newMap;
        });
      }

      setTimeout(() => {
        setAnimationMap((prevState: Map<string, IActionAnimation>) => {
          const newMap = new Map(prevState);
          newMap.delete(playerId);
          return newMap;
        });
      }, 1000);

      if (gameState.isGameOver) {
        return handleGameOverUpdates({ gameState });
      }

      if (gameState.currentRound === "preFlop" && !action) {
        return handlePreFlopUpdates({ gameState, delay: 0 });
      }

      if (gameState.currentRound === "flop" && !animateFlop) {
        playAudio(cardSlide);
        setAnimateFlop(true);
      }

      dispatch(setGameState(gameState));
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
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};
