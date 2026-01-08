import { client } from "../redis";
import { IPreGameState, RoomData } from "../../types/types";
import { getPlayerCoins } from "../../services/game";
import { ROOMS_KEY } from "../../constants/constants";
import { assignSeatIndex, initializePlayer, sortPlayersBySeat } from "./game";

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
  if (!roomJSON) return { status: "error" };

  const room: RoomData = JSON.parse(roomJSON);

  if (room.players.some((p) => p.userId === playerId)) {
    return { status: "roomReconnect" };
  }

  const playerCoins = await getPlayerCoins(playerId);
  if (playerCoins < room.minStake) return { status: "insufficientFunds" };

  if (room.players.length >= room.maxPlayers) return { status: "roomFull" };

  room.players.push({ userId: playerId, userName });

  const gameInProgress = room.gameState && "deck" in room.gameState;

  if (!room.gameState || !gameInProgress) {
    room.gameState = {
      players: room.players.map((p, i) =>
        initializePlayer({
          minStake: room.minStake,
          playerInfo: { userId: p.userId, userName: p.userName },
          seatIndex: i,
          isFold: true,
        })
      ),
    } as IPreGameState;
  } else {
    const seatIndex = assignSeatIndex(room.gameState.players, room.maxPlayers);

    const newPlayer = initializePlayer({
      minStake: room.minStake,
      playerInfo: { userId: playerId, userName },
      seatIndex,
      isFold: true,
    });

    room.gameState.players.push(newPlayer);
    room.gameState.players = sortPlayersBySeat(room.gameState.players);
  }

  await client.set(`${ROOMS_KEY}:${roomId}`, JSON.stringify(room));

  if (!gameInProgress && room.players.length === room.maxPlayers) {
    return { status: "gameStart" };
  }

  return {
    status: "roomJoined",
    data: room.gameState,
  };
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
    return false;
  }

  const room: RoomData = JSON.parse(roomJSON);

  if (!room.players.some((player) => player.userId === userId)) {
    return false;
  }

  room.players = room.players.filter((player) => player.userId !== userId);

  if (room.gameState) {
    room.gameState.players = room.gameState.players.filter(
      (player) => player.playerInfo.userId !== userId
    );
  }

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

  const roomDataPromises = roomKeys.map(async (roomKey: string) => {
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
