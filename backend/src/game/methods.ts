import { IGame, RoomData, IPlayer } from "../types/types";
import { client } from "../index";
import { Game } from "./classes";

const ROOMS_KEY = "rooms";

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

const initializeGame = async (roomId: string) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" }; // Room doesn't exist
  }

  const room: RoomData = JSON.parse(roomJSON);

  room.gameState = {
    totalPot: 0,
    playerTurn: null,
    communityCards: [],
    deck: [],
    players: [],
    lastBet: 0,
    movesCount: 0,
    currentRound: "preFlop",
    winner: null,
  };

  if (room.gameState) {
    room.gameState.deck = deck;

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
        coins: 1000000,
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
    room.gameState.totalPot = 0;
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

export { initializeGame, retrieveGameState, saveGameState };
