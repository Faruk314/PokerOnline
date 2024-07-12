import { GetUserCallback, RoomData, UserData } from "../types/types";
import { client } from "./../index";

const ROOMS_KEY = "rooms";

const addUser = (userInfo: UserData) => {
  const { userId } = userInfo;

  client
    .hsetnx("users", userId.toString(), JSON.stringify(userInfo))
    .then((added) => {
      if (added === 1) {
        console.log(`User ${userId} added to Redis`);
      } else {
        console.log(`User ${userId} already exists in Redis`);
      }
    })
    .catch((err: Error) => {
      console.error("Error adding user to Redis:", err);
    });
};

const removeUser = (userId: number) => {
  client.hdel("users", userId.toString());
};

const getUser = (userId: number, callback: GetUserCallback) => {
  client.hget("users", userId.toString(), (err, userJSON) => {
    if (err) {
      console.error("Error fetching user from Redis:", err);
      callback(null);
      return;
    }
    if (userJSON) {
      const userInfo = JSON.parse(userJSON);
      callback(userInfo);
    } else {
      callback(null);
    }
  });
};

const createRoom = async (roomData: RoomData) => {
  const { roomId, maxPlayers } = roomData;
  const roomExists = await client.exists(`${ROOMS_KEY}:${roomId}`);

  if (roomExists) {
    console.log(`Room ${roomId} already exists in Redis.`);
    return false;
  }

  await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(roomData));
  console.log(
    `Room ${roomId} created in Redis with max ${maxPlayers} players.`
  );
  return true;
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

  // Add player to room
  room.players.push({ userId: playerId, userName });

  await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));
  console.log(`Player ${playerId} joined room ${roomId} in Redis.`);

  if (room.players.length === room.maxPlayers) {
    return { status: "gameStart" };
  }

  return { status: "roomJoined" };
};

// const leaveRoom = async (roomId: string, userId: number) => {
//   const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

//   if (!roomJSON) {
//     console.log(`Room ${roomId} does not exist in Redis.`);
//     return false; // Room doesn't exist
//   }

//   const room: RoomData = JSON.parse(roomJSON);

//   const
//   // Check if the player is in the room
//   if (!room.players.includes(userId)) {
//     console.log(`Player ${userId} is not in room ${roomId}.`);
//     return false; // Player is not in the room
//   }

//   // Remove player from room
//   room.players = room.players.filter((player) => player.userId !== userId);
//   await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));
//   console.log(`Player ${userId} left room ${roomId} in Redis.`);

//   return true;
// };

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

const getRoom = async (roomKey: string) => {
  const roomJSON = await client.get("");
};

export { addUser, removeUser, getUser, createRoom, joinRoom, getRooms };
