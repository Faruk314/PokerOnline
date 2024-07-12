import { Suspense, useContext, useEffect } from "react";
import Game from "./pages/Game";
import { Routes, Route, useNavigate } from "react-router-dom";
import Menu from "./pages/Menu";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAppDispatch } from "./store/hooks";
import { getLoginStatus } from "./store/slices/auth";
import Loader from "./components/Loader";
import "./App.css";
import ProtectedRoutes from "./protection/ProtectedRoutes";
import { SocketContext } from "./context/SocketContext";
import { toast } from "react-toastify";
import { setGameState } from "./store/slices/game";
import { IGame } from "./types/types";

function App() {
  const { socket } = useContext(SocketContext);
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
    socket?.on(
      "gameStarted",
      ({ roomId, gameState }: { roomId: string; gameState: IGame }) => {
        dispatch(setGameState(gameState));
        navigate(`/game/${roomId}`);
      }
    );

    return () => {
      socket?.off("gameStarted");
    };
  }, [socket, navigate, dispatch]);

  useEffect(() => {
    socket?.on("playerMoved", ({ gameState }: { gameState: IGame }) => {
      console.log(gameState, "gameState after player moves");
      dispatch(setGameState(gameState));
    });

    return () => {
      socket?.off("playerMoved");
    };
  }, [socket, dispatch]);

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
