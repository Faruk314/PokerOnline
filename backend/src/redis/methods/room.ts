import { client } from "../redis";
import { RoomData } from "../../types/types";
import { getPlayerCoins } from "../../services/game";
// import { getPlayerChips } from "../../controllers/game";

const ROOMS_KEY = "rooms";

const createRoom = async (roomData: RoomData) => {
  const { roomId } = roomData;

  const roomExists = await client.exists(`${ROOMS_KEY}:${roomId}`);

  if (roomExists) {
    return false;
  }

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(roomData));

    return true;
  } catch (err) {
    return false;
  }
};

const joinRoom = async ({
  roomId,
  playerId,
  userName,
}: {
  roomId: string;
  playerId: string;
  userName: string;
}) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" };
  }

  const room: RoomData = JSON.parse(roomJSON);

  if (room.players.length >= room.maxPlayers) {
    console.log(`Room ${roomId} is full.`);
    return { status: "roomFull" };
  }

  const playerCoins = await getPlayerCoins(playerId);

  if (playerCoins < room.minStake) {
    return { status: "insufficientFunds" };
  }

  // Add player to room
  room.players.push({ userId: playerId, userName });

  await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));

  if (room.players.length === room.maxPlayers) {
    return { status: "gameStart" };
  }

  return { status: "roomJoined" };
};

const leaveRoom = async ({
  roomId,
  userId,
}: {
  roomId: string;
  userId: string;
}) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    return false; // Room doesn't exist
  }

  const room: RoomData = JSON.parse(roomJSON);

  // Check if the player is in the room
  if (!room.players.some((player) => player.userId === userId)) {
    return false; // Player is not in the room
  }

  // Remove player from room
  room.players = room.players.filter((player) => player.userId !== userId);

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));

    return true;
  } catch (err) {
    console.error(err);
    return false;
  }
};

const getRooms = async (): Promise<RoomData[]> => {
  const roomKeys = await client.keys(`${ROOMS_KEY}:*`);
  const roomDataArray: RoomData[] = [];

  if (roomKeys.length === 0) {
    return roomDataArray;
  }

  const roomDataPromises = roomKeys.map(async (roomKey) => {
    const roomJSON = await client.get(roomKey);
    if (roomJSON) {
      const roomData: RoomData = JSON.parse(roomJSON);
      roomDataArray.push({ ...roomData, gameState: null });
    }
  });

  await Promise.all(roomDataPromises);

  return roomDataArray;
};

export { createRoom, joinRoom, leaveRoom, getRooms };
