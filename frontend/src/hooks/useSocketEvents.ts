import { Socket } from "socket.io-client";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useSocketEvent } from "./useSocketEvent";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useContext } from "react";
import { GameContext } from "../context/GameContext";
import { IGame, IGameEndData } from "../types/types";
import { setGameState, setGameStatus } from "../store/slices/game";

export const useSocketEvents = (socket: Socket) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { handleUpdateGame, handlePreFlopUpdates } = useContext(GameContext);
  const loggedUserId = useAppSelector(
    (state) => state.auth.loggedUserInfo?.userId
  );

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

  useSocketEvent(
    socket,
    "gameStarted",
    ({ gameState, roomId }: { gameState: IGame; roomId: string }) => {
      navigate(`/game/${roomId}`);
      handlePreFlopUpdates({ gameState, delay: 500 });
    }
  );

  useSocketEvent(socket, "updateGame", handleUpdateGame);

  useSocketEvent(socket, "roomCreated", () => {
    toast.success("Room created");
  });
};
