import { Queue } from "bullmq";
import connection from "../connection";

export const RESET_GAME_QUEUE_NAME = "resetGameQueue";

export class resetGameQueue {
  static instance: resetGameQueue;
  queue: Queue<any, any, string, any, any, string>;

  constructor() {
    this.queue = new Queue(RESET_GAME_QUEUE_NAME, { connection });
  }

  static getInstance() {
    if (resetGameQueue.instance) {
      return resetGameQueue.instance;
    }
    resetGameQueue.instance = new resetGameQueue();
    return resetGameQueue.instance;
  }

  addTimer = async (roomId: string, resetDuration = 10 * 1000) => {
    try {
      await this.queue.add(
        `resetGameTimer-${roomId}`,
        { roomId },
        {
          delay: resetDuration,
          jobId: `resetGameTimer-${roomId}`,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );
    } catch (error) {
      console.error("Error scheduling reset game timer:", error);
    }
  };
}
