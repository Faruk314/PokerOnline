import { getPlayerChips } from "../controllers/game";
import { RoomData, UserData } from "../types/types";
import { client } from "./../index";

const ROOMS_KEY = "rooms";

const addUser = async (userInfo: UserData): Promise<void> => {
  const { userId } = userInfo;

  try {
    await client.hset("users", userId.toString(), JSON.stringify(userInfo));
    console.log(`User ${userId} has been added/updated in Redis`);
  } catch (err) {
    console.error("Error adding/updating user in Redis:", err);
  }
};

const removeUser = (userId: number) => {
  client.hdel("users", userId.toString());
};

const getUser = async (userId: number): Promise<UserData | null> => {
  try {
    const userJSON = await client.hget("users", userId.toString());
    return userJSON ? JSON.parse(userJSON) : null;
  } catch (err) {
    console.error("Error fetching user from Redis:", err);
    return null;
  }
};

const createRoom = async (roomData: RoomData) => {
  const { roomId, maxPlayers } = roomData;
  const roomExists = await client.exists(`${ROOMS_KEY}:${roomId}`);

  if (roomExists) {
    console.log(`Room ${roomId} already exists in Redis.`);
    return false;
  }

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(roomData));
    console.log(
      `Room ${roomId} created in Redis with max ${maxPlayers} players.`
    );
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
  playerId: number;
  userName: string;
}) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return { status: "error" }; // Room doesn't exist
  }

  const room: RoomData = JSON.parse(roomJSON);

  if (room.players.length >= room.maxPlayers) {
    console.log(`Room ${roomId} is full.`);
    return { status: "roomFull" }; // Room is full
  }

  const playerFunds: { chips: number } | undefined = await getPlayerChips(
    playerId
  );

  if (playerFunds && playerFunds?.chips < room.minStake) {
    return { status: "insufficientFunds" };
  }

  // Add player to room
  room.players.push({ userId: playerId, userName });

  await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));
  console.log(`Player ${playerId} joined room ${roomId} in Redis.`);

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
  userId: number;
}) => {
  const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

  if (!roomJSON) {
    console.log(`Room ${roomId} does not exist in Redis.`);
    return false; // Room doesn't exist
  }

  const room: RoomData = JSON.parse(roomJSON);

  // Check if the player is in the room
  if (!room.players.some((player) => player.userId === userId)) {
    console.log(`Player ${userId} is not in room ${roomId}.`);
    return false; // Player is not in the room
  }

  // Remove player from room
  room.players = room.players.filter((player) => player.userId !== userId);

  try {
    await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));
    console.log(`Player ${userId} left room ${roomId} in Redis.`);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getRooms = async (): Promise<RoomData[]> => {
  const roomKeys = await client.keys(`${ROOMS_KEY}:*`);
  const roomDataArray: RoomData[] = [];

  if (roomKeys.length === 0) {
    console.log("No rooms found in Redis.");
    return roomDataArray;
  }

  const roomDataPromises = roomKeys.map(async (roomKey) => {
    const roomJSON = await client.get(roomKey);
    if (roomJSON) {
      const roomData: RoomData = JSON.parse(roomJSON);
      roomDataArray.push(roomData);
    }
  });

  await Promise.all(roomDataPromises);

  return roomDataArray;
};

export {
  addUser,
  removeUser,
  getUser,
  createRoom,
  joinRoom,
  getRooms,
  leaveRoom,
};
