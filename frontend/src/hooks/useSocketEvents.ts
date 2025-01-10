import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useSocketEvent } from "./useSocketEvent";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { IGame, IGameEndData } from "../types/types";
import { setGameState, setGameStatus } from "../store/slices/game";
import { SocketContext } from "../context/SocketContext";

export const useSocketEvents = () => {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleUpdateGame, handlePreFlopUpdates } = useContext(GameContext);
  const { socket } = useContext(SocketContext);
  const loggedUserId = useAppSelector(
    (state) => state.auth.loggedUserInfo?.userId
  );

  useSocketEvent(
    socket,
    "gameStarted",
    ({ gameState, roomId }: { gameState: IGame; roomId: string }) => {
      navigate(`/game/${roomId}`);
      handlePreFlopUpdates({ gameState, delay: 500 });
    }
  );

  useSocketEvent(socket, "connect", () => {
    const id = location.pathname.startsWith("/game/")
      ? location.pathname.split("/game/")[1]
      : null;

    socket?.emit("reconnectToRoom", id);
  });

  useSocketEvent(socket, "gameEnd", (data: IGameEndData) => {
    const gameStatus = {
      isGameOver: true,
      reason: data.reason,
    };

    dispatch(setGameStatus(gameStatus));
    dispatch(setGameState(null));
    navigate("/menu");
  });

  useSocketEvent(socket, "roomJoined", ({ roomId }) => {
    navigate(`/game/${roomId}`);
  });

  useSocketEvent(socket, "roomFull", () => {
    toast.error("This room is full");
  });

  useSocketEvent(socket, "playerLeft", ({ playerId, userName }) => {
    const user = loggedUserId === playerId ? `You` : `Player ${userName}`;
    toast.error(`${user} left the game`);
  });

  useSocketEvent(socket, "updateGame", handleUpdateGame);

  useSocketEvent(socket, "roomCreated", () => {
    toast.success("Room created");
  });
};
