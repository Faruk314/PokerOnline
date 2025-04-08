import { Server, Socket } from "socket.io";
import http from "http";
import dotenv from "dotenv";
import { addUser } from "../redis/methods/user";
import { getUserSessionById } from "../redis/methods/session";
import { getUser } from "../services/auth";
import GameListeners from "./listeners/game";
import RoomListeners from "./listeners/room";
dotenv.config();

export default function setupSocket(httpServer: http.Server) {
  const io = new Server(httpServer, {
    cors: {
      origin: "http://localhost:5001",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(async (socket: Socket, next) => {
    const cookieHeader = socket.request.headers.cookie;

    if (!cookieHeader)
      return console.error("Cookies are missing in socket io middleware");

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const sessionId = cookies.sessionId;

    if (!sessionId)
      return console.error("SessionId is missing in Socket io middleware");

    const session = await getUserSessionById(sessionId);

    if (!session) {
      return console.error(
        "Could not find user session in Socket io middleware"
      );
    }

    try {
      const user = await getUser(session.userId);

      if (!user)
        return console.error("Could not get user in socket io middleware");

      socket.userId = user.userId;
      socket.userName = user.userName;
      next();
    } catch (error) {
      console.error(error);
    }
  });

  io.on("connection", async (socket: Socket) => {
    if (socket.userId && socket.userName && socket.id) {
      const userInfo = {
        userId: socket.userId,
        userName: socket.userName,
        userSocketId: socket.id,
      };

      await addUser(userInfo);
    }

    const gameListeners = new GameListeners(io, socket);
    gameListeners.registerListeners();

    const roomListeners = new RoomListeners(io, socket);
    roomListeners.registerListeners();
  });

  io.listen(process.env.WS_PORT ? parseInt(process.env.WS_PORT) : 5001);

  return io;
}
