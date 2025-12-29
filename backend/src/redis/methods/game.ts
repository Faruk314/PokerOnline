import { IGame, RoomData, IPlayer, IPlayersMap } from "../../types/types";
import { client } from "../redis";
import Game from "../../game/game";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { decrementPlayerCoins } from "../../services/game";
import { ROOMS_KEY } from "../../constants/constants";
import { suits, ranks } from "../../constants/constants";

dotenv.config();

const generateDeck = () => {
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
    io: null,
    roomId,
    tablePositions: {},
    minRaiseDiff: 0,
    totalPot: 0,
    playerTurn: null,
    communityCards: [],
    deck: [],
    players: [],
    lastMaxBet: 0,
    currentRound: "preFlop",
    potInfo: {},
    isGameOver: false,
  };

  if (!room.gameState) return false;

  room.gameState.deck = generateDeck();

  for (let i = 0; i < room.players.length; i++) {
    if (!room.gameState?.deck) return;

    const user = room.players[i];

    const firstRandomCardIndex = Math.floor(
      Math.random() * room.gameState.deck.length
    );

    const firstCard = room.gameState.deck.splice(firstRandomCardIndex, 1);

    const secondRandomCardIndex = Math.floor(
      Math.random() * room.gameState.deck.length
    );

    const secondCard = room.gameState.deck.splice(secondRandomCardIndex, 1);

    const playerBalanceUpdated = await decrementPlayerCoins(
      user.userId,
      room.minStake
    );

    if (!playerBalanceUpdated) return false;

    const player: IPlayer = {
      coins: room.minStake,
      playerInfo: user,
      isDealer: false,
      isSmallBind: false,
      isBigBind: false,
      cards: [...firstCard, ...secondCard],
      isAllIn: false,
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
      showCards: false,
    };

    room.gameState?.players.push(player);
  }

  room.gameState.tablePositions = determineTablePositions(room.gameState);

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

  const playerTurnIndex = (smallBindIndex + 2) % room.gameState.players.length;

  room.gameState.lastMaxBet = bigBindAmount;
  room.gameState.playerTurn = room.gameState.players[playerTurnIndex];

  const start = Date.now();
  const turnDuration = 30000;

  room.gameState.playerTurn.time = {
    startTime: new Date(start),
    endTime: new Date(start + turnDuration),
  };
  room.gameState.minRaiseDiff = bigBindAmount / 2;
  room.gameState.totalPot = bigBindAmount + bigBindAmount / 2;
  room.gameState.communityCards = [];

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));

    return { roomId, gameState: room.gameState, players: room.players };
  } catch (error) {
    return false;
  }
};

const retrieveGameState = async (roomId: string, io: Server) => {
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
      io,
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
  room.gameState.io = null;

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

const determineTablePositions = (gameState: IGame) => {
  let playersMap: IPlayersMap = {};

  const positions = [
    "bottomCenter",
    "bottomLeft",
    "left",
    "topLeft",
    "topCenter",
    "topRight",
    "right",
    "bottomRight",
  ];

  const totalPlayers = gameState.players.length;

  for (let i = 0; i < totalPlayers; i++) {
    const currentIterationId = gameState.players[i].playerInfo.userId;

    if (!playersMap[currentIterationId]) {
      playersMap[currentIterationId] = {};
    }

    for (let j = 0; j < totalPlayers; j++) {
      const otherPlayerId = gameState.players[j].playerInfo.userId;

      const relativeIndex = (j - i + totalPlayers) % totalPlayers;

      playersMap[currentIterationId][otherPlayerId] = positions[relativeIndex];
    }
  }

  return playersMap;
};

export {
  initializeGame,
  retrieveGameState,
  saveGameState,
  deleteGameState,
  generateDeck,
};
