import { Server, Socket } from "socket.io";
import { CreateRoomData } from "../../types/types";
import { createRoom, joinRoom, leaveRoom } from "../../redis/methods/room";
import { v4 as uuidv4 } from "uuid";
import { initializeGame, retrieveGameState } from "../../redis/methods/game";
import { Game } from "../../game/classes";
import { playerTimerQueue } from "../../jobs/queues/playerTimerQueue";

class RoomListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("reconnectToRoom", this.onReconnectToRoom.bind(this));
    this.socket.on("createRoom", this.onCreateRoom.bind(this));
    this.socket.on("joinRoom", this.onJoinRoom.bind(this));
    this.socket.on("leaveRoom", this.onLeaveRoom.bind(this));
  }

  onReconnectToRoom(roomId: string) {
    this.socket.join(roomId);
  }

  async onCreateRoom(data: CreateRoomData) {
    const stakes = [500, 1000, 10000, 50000, 100000, 500000, 1000000];

    if (!this.socket.id) return console.log("socket id missing in create room");

    if (data.maxPlayers > 6 || data.maxPlayers < 1) {
      return console.log("Invalid maxPlayers number");
    }

    const isValidStake = stakes.some((stake) => stake === data.minStake);

    if (!isValidStake) return console.log("Invalid min stake amount");

    const roomId = uuidv4();
    const { maxPlayers, roomName, minStake } = data;

    const roomData = {
      roomId,
      maxPlayers,
      roomName,
      minStake,
      players: [],
      gameState: null,
    };

    const roomCreated = await createRoom(roomData);

    if (roomCreated) {
      this.io.to(this.socket.id).emit("roomCreated");
    }
  }

  async onJoinRoom(data: { roomId: string }) {
    const { roomId } = data;

    const userId = this.socket.userId;
    const userName = this.socket.userName;

    if (!userId || !userName) return;

    const response = await joinRoom({ roomId, playerId: userId, userName });

    if (response.status === "roomFull") {
      return this.io
        .to(this.socket.id)
        .emit("joinRoomDenied", { reason: response.status });
    }

    if (response.status === "insufficientFunds") {
      return this.io
        .to(this.socket.id)
        .emit("joinRoomDenied", { reason: response.status });
    }

    if (response.status === "roomJoined") {
      this.socket.join(roomId);
      return this.io.to(this.socket.id).emit("roomJoined", { roomId });
    }

    if (response.status === "gameStart") {
      this.socket.join(roomId);

      const gameInfo = await initializeGame(roomId);

      if (!gameInfo) return console.log("Could not initialize game");

      const playerTurnId = gameInfo.gameState?.playerTurn?.playerInfo.userId!;
      const endDate = gameInfo.gameState?.playerTurn?.time?.endTime!;

      const game = new Game({
        ...gameInfo.gameState!,
        io: this.io,
      });

      await playerTimerQueue
        .getInstance()
        .addTimer(roomId, playerTurnId, endDate);

      await game.updateGameState(null, "gameStarted");
    }
  }

  async onLeaveRoom({ roomId }: { roomId: string }) {
    if (!this.socket.userId) return;

    const playerLeft = await leaveRoom({ roomId, userId: this.socket.userId });

    if (!playerLeft) return;

    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurnId = game.playerTurn?.playerInfo.userId;

    if (playerTurnId === this.socket.userId)
      await playerTimerQueue
        .getInstance()
        .removeTimer(roomId, this.socket.userId);

    await game.disconnect(this.socket.userId, this.socket.userName!);

    await game.updateGameState(null);
  }
}

export default RoomListeners;
