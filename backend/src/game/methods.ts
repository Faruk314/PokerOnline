import { IGame, RoomData, IPlayer } from "../types/types";
import { client } from "../index";
import { Game } from "./classes";
import cron from "node-cron";
import { Server } from "socket.io";

const ROOMS_KEY = "rooms";
let countdown: any = null;
let resetGameCountdown: any = null;

const generateDeck = () => {
  const suits = ["H", "D", "C", "S"];
  const ranks = [
    "A",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "J",
    "Q",
    "K",
  ];

  const deck: string[] = [];

  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push(`${suit}${rank}`);
    }
  }

  return deck;
};

const initializeGame = async (roomId: string) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" }; // Room doesn't exist
  }

  const room: RoomData = JSON.parse(roomJSON);

  room.gameState = {
    roomId,
    totalPot: 0,
    playerTurn: null,
    communityCards: [],
    deck: [],
    players: [],
    lastBet: 0,
    movesCount: 0,
    currentRound: "preFlop",
    winner: null,
    draw: {
      isDraw: false,
      potSpliters: [],
    },
  };

  if (room.gameState) {
    room.gameState.deck = generateDeck();

    room.players.forEach((user) => {
      if (!room.gameState?.deck) return;

      const firstRandomCardIndex = Math.floor(
        Math.random() * room.gameState?.deck.length
      );

      const firstCard = room.gameState.deck.splice(firstRandomCardIndex, 1);

      const secondRandomCardIndex = Math.floor(
        Math.random() * room.gameState?.deck.length
      );

      const secondCard = room.gameState.deck.splice(secondRandomCardIndex, 1);

      const player: IPlayer = {
        coins: 10000,
        playerInfo: user,
        isDealer: false,
        isSmallBind: false,
        isBigBind: false,
        cards: [...firstCard, ...secondCard],
        isFold: false,
        isCall: false,
        isCheck: false,
        playerRaise: {
          amount: 0,
          isRaise: false,
        },
        playerPot: 0,
        hand: null,
        time: null,
      };

      room.gameState?.players.push(player);
    });

    const randomNumber = Math.floor(
      Math.random() * room.gameState?.players.length
    );

    const bigBindAmount = 50;

    room.gameState.players[randomNumber].isDealer = true;

    const smallBindIndex = (randomNumber + 1) % room.gameState.players.length;

    room.gameState.players[smallBindIndex].isSmallBind = true;
    room.gameState.players[smallBindIndex].playerPot = bigBindAmount / 2;
    room.gameState.players[smallBindIndex].coins -= bigBindAmount / 2;

    const bigBindIndex = (smallBindIndex + 1) % room.gameState.players.length;

    room.gameState.players[bigBindIndex].isBigBind = true;
    room.gameState.players[bigBindIndex].playerPot = bigBindAmount;
    room.gameState.players[bigBindIndex].coins -= bigBindAmount;

    const playerTurnIndex =
      (smallBindIndex + 2) % room.gameState.players.length;

    room.gameState.lastBet = bigBindAmount;
    room.gameState.playerTurn = room.gameState.players[playerTurnIndex];

    const start = Date.now();
    const turnDuration = 30000;

    room.gameState.playerTurn.time = {
      startTime: new Date(start),
      endTime: new Date(start + turnDuration),
    };
    room.gameState.totalPot = bigBindAmount + bigBindAmount / 2;
    room.gameState.communityCards = [];
  }

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));

    return { roomId, gameState: room.gameState, players: room.players };
  } catch (error) {
    return false;
  }
};

const retrieveGameState = async (roomId: string) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" };
  }

  const room: RoomData = JSON.parse(roomJSON);

  if (room.gameState) {
    const gameState = room.gameState as IGame;

    if (!gameState.playerTurn) return { status: "error" };

    const game = new Game({
      ...gameState,
    });

    return { status: "success", gameState: game };
  }

  return { status: "error", gameState: null };
};

const saveGameState = async (roomId: string, gameState: IGame) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" };
  }

  const room: RoomData = JSON.parse(roomJSON);

  room.gameState = gameState;

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));
    return { status: "success" };
  } catch (error) {
    return { status: "error", message: "Failed to save game state" };
  }
};

const deleteGameState = async (roomId: string) => {
  try {
    const result = await client.del(`${ROOMS_KEY}:${roomId}`);

    if (result === 1) {
      return { status: "success" };
    } else {
      return {
        status: "error",
        message: "Room does not exist or could not be deleted",
      };
    }
  } catch (error) {
    return { status: "error", message: "Failed to delete room from Redis" };
  }
};

const handleTimePassed = async ({
  roomId,
  io,
}: {
  roomId: string;
  io: Server;
}) => {
  const response = await retrieveGameState(roomId);

  if (response.status === "success" && response.gameState) {
    const playerTurn = response.gameState.playerTurn;
    const game = response.gameState;

    if (!playerTurn?.time) return;

    playerTurn.fold();

    game.isRoundOver();

    game.switchTurns();

    if (game.draw.isDraw || game.winner) {
      await resetGame({ roomId, io });
    } else {
      const data = {
        roomId,
        targetTime: game.playerTurn?.time?.endTime,
        io,
      };
      await initializeCountdown(data);
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

const initializeCountdown = async ({
  roomId,
  targetDate,
  io,
}: {
  roomId: string;
  targetDate?: Date;
  io: Server;
}) => {
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
      await handleTimePassed({ roomId, io });
    }
  );

  countdown.start();
};

const resetGame = async ({ roomId, io }: { roomId: string; io: Server }) => {
  const resetTimer = 5;

  if (countdown) countdown.stop();

  if (resetGameCountdown) resetGameCountdown.stop();

  resetGameCountdown = cron.schedule(`*/${resetTimer} * * * * *`, async () => {
    const response = await retrieveGameState(roomId);

    if (response.status === "success" && response.gameState) {
      const game = response.gameState;

      game.resetGame();

      const playerTurn = game.playerTurn;

      const data = {
        roomId,
        targetDate: playerTurn?.time?.endTime!,
        io,
      };

      await initializeCountdown(data);

      await saveGameState(roomId, game);

      io.to(roomId).emit("updateGame", { gameState: game, roomId });

      resetGameCountdown.stop();
    }
  });

  resetGameCountdown.start();
};

export {
  initializeGame,
  retrieveGameState,
  saveGameState,
  deleteGameState,
  generateDeck,
  initializeCountdown,
  resetGame,
};
