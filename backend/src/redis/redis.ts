import { Redis } from "ioredis";
import playerTimerWorker from "../jobs/workers/playerTimerWorker";
import resetGameWorker from "../jobs/workers/resetGameWorker";

const redisPort = parseInt(
  process.env.REDIS_PORT ? process.env.REDIS_PORT : "6379"
);

const client = new Redis({
  host: process.env.REDIS_HOST,
  port: redisPort,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASS,
});

resetGameWorker.run();
playerTimerWorker.run();

export { redisPort, client };
