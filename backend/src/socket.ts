import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { RoomData, VerifiedToken } from "./types/types";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { addUser, createRoom, joinRoom } from "./socket/socketMethods";
import {
  initializeGame,
  retrieveGameState,
  saveGameState,
} from "./game/methods";

dotenv.config();

export default function setupSocket() {
  const server = http.createServer();

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token;

    try {
      const decodedToken = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as VerifiedToken;
      socket.userId = decodedToken.userId;
      socket.userName = decodedToken.userName;
      next();
    } catch (error) {
      console.log(error);
    }
  });

  io.on("connection", (socket: Socket) => {
    if (socket.userId && socket.userName && socket.id) {
      const userInfo = {
        userId: socket.userId,
        userName: socket.userName,
        userSocketId: socket.id,
      };

      addUser(userInfo);
    }

    socket.on("reconnectToRoom", (roomId: string) => {
      console.log(roomId);
      socket.join(roomId);
    });

    socket.on(
      "createRoom",
      async (data: { maxPlayers: number; roomName: string }) => {
        const roomId = uuidv4();
        const { maxPlayers, roomName } = data;

        const roomData = {
          roomId,
          maxPlayers,
          roomName,
          players: [],
          gameState: null,
        };

        const roomCreated = await createRoom(roomData);

        if (roomCreated) {
          io.to(socket.id).emit("roomCreated");
        }
      }
    );

    socket.on("joinRoom", async (data: { roomId: string }) => {
      const { roomId } = data;

      const userId = socket.userId;
      const userName = socket.userName;

      if (!userId || !userName) return;

      const response = await joinRoom({ roomId, playerId: userId, userName });

      if (response.status === "roomJoined") {
        socket.join(roomId);

        io.to(socket.id).emit("roomJoined", { roomId });
      }

      if (response.status === "gameStart") {
        socket.join(roomId);

        const gameInfo = await initializeGame(roomId);

        if (gameInfo) {
          io.to(roomId).emit("gameStarted", gameInfo);
        }
      }

      if (response.status === "roomFull") {
        io.to(socket.id).emit("roomFull");
      }
    });

    socket.on("playerFold", async ({ roomId }: { roomId: string }) => {
      const response = await retrieveGameState(roomId);

      if (response.status === "success" && response.gameState) {
        const game = response.gameState;

        const playerTurn = game.playerTurn;

        if (!playerTurn) return;

        playerTurn.fold();

        game.isRoundOver();

        game.switchTurns();

        // game.resetGame();

        const data = await saveGameState(roomId, game);

        if (data.status === "success") {
          io.to(roomId).emit("playerMoved", { gameState: game });
        }
      }
    });

    socket.on(
      "playerRaise",
      async ({ roomId, amount }: { roomId: string; amount: number }) => {
        const response = await retrieveGameState(roomId);

        if (response.status === "success" && response.gameState) {
          const game = response.gameState;

          const playerTurn = game.playerTurn;

          if (!playerTurn) return;

          const raiseAmount = amount - playerTurn.playerPot;

          playerTurn.raise(raiseAmount);

          game.lastBet = amount;

          game.movesCount = 1;

          game.switchTurns();

          const data = await saveGameState(roomId, game);

          if (data.status === "success") {
            io.to(roomId).emit("playerMoved", { gameState: game });
          }
        }
      }
    );

    socket.on(
      "playerCall",
      async ({ roomId, amount }: { roomId: string; amount: number }) => {
        const response = await retrieveGameState(roomId);

        if (response.status === "success" && response.gameState) {
          const game = response.gameState;

          const playerTurn = game.playerTurn;

          if (!playerTurn) return;

          playerTurn.call(amount);

          game.isRoundOver();

          game.switchTurns();

          const data = await saveGameState(roomId, game);

          if (data.status === "success") {
            io.to(roomId).emit("playerMoved", { gameState: game });
          }
        }
      }
    );

    socket.on("playerCheck", async ({ roomId }: { roomId: string }) => {
      const response = await retrieveGameState(roomId);
      if (response.status === "success" && response.gameState) {
        const game = response.gameState;

        const playerTurn = game.playerTurn;

        if (!playerTurn) return;

        playerTurn.check();

        game.isRoundOver();

        game.switchTurns();

        const data = await saveGameState(roomId, game);

        if (data.status === "success") {
          io.to(roomId).emit("playerMoved", { gameState: game });
        }
      }
    });
  });

  io.listen(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 5001);
}
