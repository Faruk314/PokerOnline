import { Queue } from "bullmq";
import connection from "../connection";

export const PLAYER_TIMER_QUEUE_NAME = "playerTimerQueue";

export class playerTimerQueue {
  static instance: playerTimerQueue;

  queue: Queue<any, any, string, any, any, string>;

  constructor() {
    this.queue = new Queue(PLAYER_TIMER_QUEUE_NAME, { connection });
  }

  static getInstance() {
    if (playerTimerQueue.instance) {
      return playerTimerQueue.instance;
    }
    playerTimerQueue.instance = new playerTimerQueue();
    return playerTimerQueue.instance;
  }

  addTimer = async (roomId: string, playerId: number, endDate: Date) => {
    const now = new Date();
    const delay = endDate.getTime() - now.getTime();

    try {
      await this.queue.add(
        `playerTimer-${roomId}-${playerId}`,
        { roomId, playerId },
        {
          delay,
          jobId: `playerTimer-${roomId}-${playerId}`,
          removeOnComplete: true,
          removeOnFail: true,
        }
      );

      console.log(
        `Player timer for player ${playerId} in room ${roomId} has been scheduled`
      );
    } catch (error) {
      console.error("Failed to schedule player timer:", error);
    }
  };

  removeTimer = async (roomId: string, playerId: number) => {
    const jobId = `playerTimer-${roomId}-${playerId}`;
    const job = await this.queue.getJob(jobId);

    if (job) {
      job.remove();
      console.log(
        `Player timer for player ${playerId} in room ${roomId} has been canceled.`
      );
    } else {
      console.log(
        `No active timer found for player ${playerId} in room ${roomId}.`
      );
    }
  };
}
