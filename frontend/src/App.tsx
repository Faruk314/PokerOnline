import { Suspense, useContext, useEffect } from "react";
import Game from "./pages/Game";
import { Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getLoginStatus } from "./store/slices/auth";
import Loader from "./components/Loader";
import "./App.css";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import { SocketContext } from "./context/SocketContext";
import { toast } from "react-toastify";
import { setGameState } from "./store/slices/game";
import { IPlayerMoveArgs } from "./types/types";
import { AnimationContext } from "./context/AnimationContext";

function App() {
  const { socket } = useContext(SocketContext);
  const { animateMoveChip, setAnimateFlop, setActionAnimation, animateCard } =
    useContext(AnimationContext);
  const { loggedUserInfo } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  useEffect(() => {
    socket?.on("roomJoined", ({ roomId }) => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket?.off("roomJoined");
    };
  }, [socket, navigate]);

  useEffect(() => {
    socket?.on("roomFull", () => {
      toast.error("This room is full");
    });

    return () => {
      socket?.off("roomFull");
    };
  }, [socket]);

  useEffect(() => {
    const handlePlayerMoved = ({
      gameState,
      roomId,
      action,
      playerId,
    }: IPlayerMoveArgs) => {
      if (!socket) return;

      let updatedGameState = { ...gameState };

      if (gameState.winner) {
        if (gameState.winner.hand) {
          animateMoveChip(gameState.winner.userId, true);
        }
        setTimeout(() => {
          socket.emit("resetGame", { roomId });
        }, 3000);
      }

      if (gameState.draw.isDraw) {
        gameState.draw.potSpliters.forEach((player, index: number) => {
          setTimeout(() => {
            animateMoveChip(player.userId, true);
          }, 500 * index);
        });

        setTimeout(() => {
          socket.emit("resetGame", { roomId });
        }, 3000);
      }

      if (gameState.currentRound === "preFlop" && !action) {
        gameState.players.forEach((player) => {
          animateCard(player.playerInfo.userId);
        });

        const triggerMoveChipTime = gameState.players.length * 600;

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

        updatedGameState = {
          ...gameState,
          totalPot: 0,
        };

        dispatch(setGameState(updatedGameState));
        return;
      }

      if (gameState.currentRound === "flop") {
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
    };

    socket?.on("playerMoved", handlePlayerMoved);

    return () => {
      socket?.off("playerMoved");
    };
  }, [
    socket,
    dispatch,
    animateMoveChip,
    setAnimateFlop,
    setActionAnimation,
    loggedUserInfo?.userId,
    animateCard,
  ]);

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/menu" element={<Menu />} />
          <Route path="/game/:id" element={<Game />} />
        </Route>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Suspense>
  );
}

export default App;
