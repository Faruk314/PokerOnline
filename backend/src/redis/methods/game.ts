import { IGame, RoomData, IPlayer, IPreGameState } from "../../types/types";
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
    minRaiseDiff: 0,
    totalPot: 0,
    playerTurn: null,
    communityCards: [],
    deck: [],
    players: room.gameState?.players || [],
    lastMaxBet: 0,
    currentRound: "preFlop",
    potInfo: {},
    isGameOver: false,
  };

  if (!room.gameState) return false;

  room.gameState.deck = generateDeck();

  for (let i = 0; i < room.gameState.players.length; i++) {
    const player = room.gameState.players[i];

    const firstRandomCardIndex = Math.floor(
      Math.random() * room.gameState.deck.length
    );

    const firstCard = room.gameState.deck.splice(firstRandomCardIndex, 1);

    const secondRandomCardIndex = Math.floor(
      Math.random() * room.gameState.deck.length
    );

    const secondCard = room.gameState.deck.splice(secondRandomCardIndex, 1);

    const playerBalanceUpdated = await decrementPlayerCoins(
      player.playerInfo.userId,
      room.minStake
    );

    if (!playerBalanceUpdated) return false;

    const cards = [...firstCard, ...secondCard];

    player.cards = cards;

    player.isFold = false;
  }

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

const initializePlayer = ({
  minStake,
  playerInfo,
  seatIndex,
  isFold = true,
}: {
  minStake: number;
  playerInfo: { userId: string; userName: string };
  seatIndex: number;
  isFold: boolean;
}) => {
  const player: IPlayer = {
    coins: minStake,
    playerInfo,
    isDealer: false,
    isSmallBind: false,
    isBigBind: false,
    cards: [],
    isAllIn: false,
    isFold,
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
    seatIndex,
  };

  return player;
};

const retrieveGameState = async (roomId: string, io: Server) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" };
  }

  const room: RoomData = JSON.parse(roomJSON);

  if (room.gameState) {
    const gameState = room.gameState;

    if (!("deck" in gameState))
      return { status: "success", gameState: gameState as IPreGameState };

    const game = new Game({
      ...gameState,
      io,
    });

    return { status: "success", gameState: game as IGame };
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
  (room.gameState as IGame).io = null;

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

const assignSeatIndex = (players: IPlayer[], maxSeats: number): number => {
  const occupiedSeats = new Set(players.map((p) => p.seatIndex));

  for (let i = 0; i < maxSeats; i++) {
    if (!occupiedSeats.has(i)) return i;
  }

  throw new Error("Table is full");
};

const sortPlayersBySeat = (players: IPlayer[]) => {
  return players.sort((a, b) => a.seatIndex - b.seatIndex);
};

export {
  initializeGame,
  initializePlayer,
  retrieveGameState,
  saveGameState,
  deleteGameState,
  generateDeck,
  assignSeatIndex,
  sortPlayersBySeat,
};
