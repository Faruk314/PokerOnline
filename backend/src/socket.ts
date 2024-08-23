import { Server, Socket } from "socket.io";
import http from "http";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "./types/types";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { addUser, createRoom, joinRoom } from "./socket/socketMethods";
import {
  initializeGame,
  retrieveGameState,
  saveGameState,
} from "./game/methods";
import cron from "node-cron";
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

  let countdown: any = null;
  let resetGameCountdown: any = null;

  const resetGame = async (roomId: string) => {
    const resetTimer = 5;

    if (countdown) countdown.stop();

    if (resetGameCountdown) resetGameCountdown.stop();

    resetGameCountdown = cron.schedule(
      `*/${resetTimer} * * * * *`,
      async () => {
        const response = await retrieveGameState(roomId);

        if (response.status === "success" && response.gameState) {
          const game = response.gameState;

          game.resetGame();

          const playerTurn = game.playerTurn;

          await initializeCountdown(roomId, playerTurn?.time?.endTime!);

          await saveGameState(roomId, game);

          io.to(roomId).emit("updateGame", { gameState: game, roomId });

          resetGameCountdown.stop();
        }
      }
    );

    resetGameCountdown.start();
  };

  const initializeCountdown = async (roomId: string, targetDate: Date) => {
    if (countdown) {
      countdown.stop();
    }

    if (!targetDate)
      return console.log(
        "target date missing in initialize countdown",
        targetDate
      );

    const seconds = targetDate.getSeconds();
    const minutes = targetDate.getMinutes();
    const hours = targetDate.getHours();
    const dayOfMonth = targetDate.getDate();
    const month = targetDate.getMonth() + 1;
    const dayOfWeek = "*";

    countdown = cron.schedule(
      `${seconds} ${minutes} ${hours} ${dayOfMonth} ${month} ${dayOfWeek}`,
      async () => {
        await handleTimePassed(roomId);
      }
    );

    countdown.start();
  };

  const handleTimePassed = async (roomId: string) => {
    const response = await retrieveGameState(roomId);

    if (response.status === "success" && response.gameState) {
      const playerTurn = response.gameState.playerTurn;
      const game = response.gameState;

      if (!playerTurn?.time) return;

      playerTurn.fold();

      game.isRoundOver();

      game.switchTurns();

      if (game.draw.isDraw || game.winner) {
        await resetGame(roomId);
      } else {
        await initializeCountdown(roomId, game.playerTurn?.time?.endTime!);
      }

      const data = await saveGameState(roomId, game);

      if (data.status === "success") {
        io.to(roomId).emit("updateGame", {
          gameState: game,
          roomId,
          action: "fold",
          playerId: playerTurn.playerInfo.userId,
        });
      }
    }
  };

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

        if (!gameInfo) return;

        if (gameInfo) {
          await initializeCountdown(
            roomId,
            gameInfo.gameState?.playerTurn?.time?.endTime!
          );

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

        if (game.draw.isDraw || game.winner) {
          await resetGame(roomId);
        } else {
          await initializeCountdown(roomId, game.playerTurn?.time?.endTime!);
        }

        const data = await saveGameState(roomId, game);

        if (data.status === "success") {
          io.to(roomId).emit("updateGame", {
            gameState: game,
            roomId,
            action: "fold",
            playerId: socket.userId,
          });
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

          let raiseAmount = amount - playerTurn.playerPot;

          const allIn = amount === playerTurn.coins;

          if (allIn) {
            raiseAmount = amount;
            game.lastBet = amount + playerTurn.playerPot;
          } else {
            game.lastBet = amount;
          }

          playerTurn.raise(raiseAmount);

          game.totalPot += raiseAmount;

          game.movesCount = 1;

          game.switchTurns();

          await initializeCountdown(roomId, game.playerTurn?.time?.endTime!);

          const data = await saveGameState(roomId, game);

          if (data.status === "success") {
            io.to(roomId).emit("updateGame", {
              gameState: game,
              roomId,
              action: "raise",
              playerId: socket.userId,
            });
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

          game.totalPot += amount;

          game.isRoundOver();

          game.switchTurns();

          if (game.draw.isDraw || game.winner) {
            await resetGame(roomId);
          } else {
            await initializeCountdown(roomId, game.playerTurn?.time?.endTime!);
          }

          const data = await saveGameState(roomId, game);

          if (data.status === "success") {
            io.to(roomId).emit("updateGame", {
              gameState: game,
              roomId,
              action: "call",
              playerId: socket.userId,
            });
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

        if (game.draw.isDraw || game.winner) {
          await resetGame(roomId);
        } else {
          await initializeCountdown(roomId, game.playerTurn?.time?.endTime!);
        }

        const data = await saveGameState(roomId, game);

        if (data.status === "success") {
          io.to(roomId).emit("updateGame", {
            gameState: game,
            roomId,
            action: "check",
            playerId: socket.userId,
          });
        }
      }
    });
  });

  io.listen(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 5001);
}
