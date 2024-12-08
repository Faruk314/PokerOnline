import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import errorHandler from "./utils/error";
import authRoutes from "./routes/auth";
import gameRoutes from "./routes/game";
import http from "http";
import setupSocket from "./socket";
import playerTimerWorker from "./jobs/workers/playerTimerWorker";
import resetGameWorker from "./jobs/workers/resetGameWorker";
import { Redis } from "ioredis";
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

const server = http.createServer(app);

export const io = setupSocket(server);

app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

export const redisPort = parseInt(
  process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379"
);

export const client = new Redis({
  host: process.env.REDIS_HOST,
  port: redisPort,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

app.use("/api/auth", authRoutes);
app.use("/api/game", gameRoutes);

app.use(errorHandler);

resetGameWorker.run();
playerTimerWorker.run();
