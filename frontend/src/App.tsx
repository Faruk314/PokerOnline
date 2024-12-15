import { Suspense, useContext, useEffect, useState } from "react";
import Game from "./pages/Game";
import { Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { getLoginStatus } from "./store/slices/auth";
import Loader from "./components/Loader";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import { SocketContext } from "./context/SocketContext";
import { toast } from "react-toastify";
import { IGame, IGameEndData, TGameEndReason } from "./types/types";
import GameOver from "./modals/GameOver";
import { GameContext } from "./context/GameContext";
import "./App.css";

function App() {
  const [openEndGame, setOpenEndGame] = useState(false);
  const [reason, setReason] = useState<TGameEndReason | null>(null);
  const { socket } = useContext(SocketContext);
  const { handleUpdateGame, handlePreFlopUpdates } = useContext(GameContext);
  const loggedUserId = useAppSelector(
    (state) => state.auth.loggedUserInfo?.userId
  );
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch]);

  useEffect(() => {
    socket?.on("gameEnd", (data: IGameEndData) => {
      setOpenEndGame(true);
      setReason(data.reason);
      navigate("/menu");
    });

    return () => {
      socket?.off("gameEnd");
    };
  }, [socket, navigate]);

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
    socket?.on("playerLeft", ({ playerId, userName }) => {
      const user = loggedUserId === playerId ? `You` : `Player ${userName}`;
      toast.error(`${user} left the game`);
    });

    return () => {
      socket?.off("playerLeft");
    };
  }, [socket, loggedUserId]);

  useEffect(() => {
    const handleGameStart = ({
      gameState,
      roomId,
    }: {
      gameState: IGame;
      roomId: string;
    }) => {
      navigate(`/game/${roomId}`);

      return handlePreFlopUpdates({ gameState, delay: 500 });
    };

    socket?.on("gameStarted", handleGameStart);

    return () => {
      socket?.off("gameStarted", handleGameStart);
    };
  }, [socket, navigate, handlePreFlopUpdates]);

  useEffect(() => {
    socket?.on("updateGame", handleUpdateGame);

    return () => {
      socket?.off("updateGame", handleUpdateGame);
    };
  }, [socket, dispatch, handleUpdateGame]);

  return (
    <Suspense fallback={<Loader />}>
      {openEndGame && (
        <GameOver reason={reason} setOpenModal={setOpenEndGame} />
      )}
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
