import { Server, Socket } from "socket.io";
import http from "http";
import { CreateRoomData } from "../types/types";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { addUser } from "../redis/methods/user";
import { createRoom, joinRoom, leaveRoom } from "../redis/methods/room";
import { initializeGame, retrieveGameState } from "../redis/methods/game";
import { playerTimerQueue } from "../jobs/queues/playerTimerQueue";
import { Game } from "../game/classes";
import { getUserSessionById } from "../redis/methods/session";
import { getUser } from "../services/auth";
dotenv.config();

export default function setupSocket(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5001",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    const cookieHeader = socket.request.headers.cookie;

    if (!cookieHeader)
      return console.error("Cookies are missing in socket io middleware");

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const sessionId = cookies.sessionId;

    if (!sessionId)
      return console.error("SessionId is missing in Socket io middleware");

    const session = await getUserSessionById(sessionId);

    if (!session) {
      return console.error(
        "Could not find user session in Socket io middleware"
      );
    }

    try {
      const user = await getUser(session.userId);

      if (!user)
        return console.error("Could not get user in socket io middleware");

      socket.userId = user.userId;
      socket.userName = user.userName;
      next();
    } catch (error) {
      console.error(error);
    }
  });

  io.on("connection", async (socket: Socket) => {
    if (socket.userId && socket.userName && socket.id) {
      const userInfo = {
        userId: socket.userId,
        userName: socket.userName,
        userSocketId: socket.id,
      };

      await addUser(userInfo);
    }

    socket.on("reconnectToRoom", (roomId: string) => {
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on("createRoom", async (data: CreateRoomData) => {
      const stakes = [500, 1000, 10000, 50000, 100000, 500000, 1000000];

      if (!socket.id) return console.log("socket id missing in create room");

      if (data.maxPlayers > 6 || data.maxPlayers < 1) {
        return console.log("Invalid maxPlayers number");
      }

      const isValidStake = stakes.some((stake) => stake === data.minStake);

      if (!isValidStake) return console.log("Invalid min stake amount");

      const roomId = uuidv4();
      const { maxPlayers, roomName, minStake } = data;

      const roomData = {
        roomId,
        maxPlayers,
        roomName,
        minStake,
        players: [],
        gameState: null,
      };

      const roomCreated = await createRoom(roomData);

      if (roomCreated) {
        io.to(socket.id).emit("roomCreated");
      }
    });

    socket.on("joinRoom", async (data: { roomId: string }) => {
      const { roomId } = data;

      const userId = socket.userId;
      const userName = socket.userName;

      if (!userId || !userName) return;

      const response = await joinRoom({ roomId, playerId: userId, userName });

      if (response.status === "roomFull") {
        return io
          .to(socket.id)
          .emit("joinRoomDenied", { reason: response.status });
      }

      if (response.status === "insufficientFunds") {
        return io
          .to(socket.id)
          .emit("joinRoomDenied", { reason: response.status });
      }

      if (response.status === "roomJoined") {
        socket.join(roomId);
        return io.to(socket.id).emit("roomJoined", { roomId });
      }

      if (response.status === "gameStart") {
        socket.join(roomId);

        const gameInfo = await initializeGame(roomId);

        if (!gameInfo) return console.log("Could not initialize game");

        const playerTurnId = gameInfo.gameState?.playerTurn?.playerInfo.userId!;
        const endDate = gameInfo.gameState?.playerTurn?.time?.endTime!;

        const game = new Game({
          ...gameInfo.gameState!,
          io,
        });

        await playerTimerQueue
          .getInstance()
          .addTimer(roomId, playerTurnId, endDate);

        await game.updateGameState(null, "gameStarted");
      }
    });

    socket.on("leaveRoom", async ({ roomId }: { roomId: string }) => {
      if (!socket.userId) return;

      const playerLeft = await leaveRoom({ roomId, userId: socket.userId });

      if (!playerLeft) return;

      const response = await retrieveGameState(roomId, io);

      if (response.status !== "success") return;

      if (!response.gameState) return;

      const game = response.gameState;

      const playerTurnId = game.playerTurn?.playerInfo.userId;

      if (playerTurnId === socket.userId)
        await playerTimerQueue.getInstance().removeTimer(roomId, socket.userId);

      await game.disconnect(socket.userId, socket.userName!);

      await game.updateGameState(null);
    });

    socket.on("playerFold", async ({ roomId }: { roomId: string }) => {
      const response = await retrieveGameState(roomId, io);

      if (response.status !== "success") return;

      if (!response.gameState) return;

      const game = response.gameState;

      const playerTurn = game.playerTurn;

      if (!playerTurn) return;

      if (game.draw.isDraw || game.winner) {
        return console.log("Invalid fold");
      }

      if (playerTurn.playerInfo.userId !== socket.userId)
        return console.log("Current player is not on a move");

      await playerTimerQueue
        .getInstance()
        .removeTimer(roomId, playerTurn.playerInfo.userId);

      playerTurn.fold();

      await game.isRoundOver();

      await game.updateGameState({
        prevPlayerId: socket.userId,
        action: "fold",
      });
    });

    socket.on(
      "playerRaise",
      async ({ roomId, amount }: { roomId: string; amount: number }) => {
        const response = await retrieveGameState(roomId, io);

        if (response.status !== "success") return;

        if (!response.gameState) return;

        const game = response.gameState;

        const playerTurn = game.playerTurn;

        if (!playerTurn) return;

        if (game.draw.isDraw || game.winner) {
          return console.log("Invalid raise");
        }

        if (playerTurn.playerInfo.userId !== socket.userId)
          return console.log("Current player is not on a move");

        if (amount < game.minRaiseAmount || amount > game.playerTurn?.coins!)
          return console.log("Invalid raise amount!");

        const allIn = game.players.some((p) => p.coins === 0);

        if (allIn)
          return console.log("Could not raise. Previous player went all in");

        await playerTimerQueue
          .getInstance()
          .removeTimer(roomId, playerTurn.playerInfo.userId);

        const action = playerTurn.raise(amount);

        game.lastBet = playerTurn.playerPot;

        game.totalPot += amount;

        game.minRaiseAmount = amount * 2;

        game.movesCount = 1;

        await game.switchTurns();

        await game.updateGameState({
          prevPlayerId: socket.userId,
          action,
        });
      }
    );

    socket.on(
      "playerCall",
      async ({ roomId, amount }: { roomId: string; amount: number }) => {
        const response = await retrieveGameState(roomId, io);

        if (response.status !== "success") return;

        if (!response.gameState) return;

        const game = response.gameState;

        const playerTurn = game.playerTurn;

        if (!playerTurn) return;

        if (game.draw.isDraw || game.winner) {
          return console.log("Invalid call");
        }

        if (playerTurn.playerInfo.userId !== socket.userId)
          return console.log("Current player is not on a move");

        let callAmount = game.lastBet - playerTurn.playerPot;

        if (callAmount > playerTurn.coins) {
          callAmount = playerTurn.coins;
        }

        if (amount !== callAmount) return console.log("Invalid call amount");

        await playerTimerQueue
          .getInstance()
          .removeTimer(roomId, playerTurn.playerInfo.userId);

        const action = playerTurn.call(amount);

        game.totalPot += amount;

        await game.isRoundOver();

        await game.updateGameState({
          prevPlayerId: socket.userId,
          action,
        });
      }
    );

    socket.on("playerCheck", async ({ roomId }: { roomId: string }) => {
      const response = await retrieveGameState(roomId, io);

      if (response.status !== "success") return;

      if (!response.gameState) return;

      const game = response.gameState;

      const playerTurn = game.playerTurn;

      if (!playerTurn) return;

      if (game.draw.isDraw || game.winner) {
        return console.log("Invalid check");
      }

      if (playerTurn.playerInfo.userId !== socket.userId)
        return console.log("Current player is not on a move");

      const callAmount = game.lastBet - playerTurn.playerPot;

      const canCheck = callAmount <= 0;

      if (!canCheck) return console.log("Invalid check");

      await playerTimerQueue
        .getInstance()
        .removeTimer(roomId, playerTurn.playerInfo.userId);

      playerTurn.check();

      await game.isRoundOver();

      await game.updateGameState({
        prevPlayerId: socket.userId,
        action: "check",
      });
    });
  });

  io.listen(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 5001);

  return io;
}
