import { RESET_GAME_QUEUE_NAME } from "../queues/resetGameQueue";
import { retrieveGameState } from "../../redis/methods/game";
import { io } from "../..";
import { Worker, Job } from "bullmq";
import connection from "../connection";

const resetGameWorker = new Worker(
  RESET_GAME_QUEUE_NAME,
  async (job: Job) => {
    const { roomId } = job.data;

    try {
      const response = await retrieveGameState(roomId, io);

      if (response.status === "success" && response.gameState) {
        const game = response.gameState;

        await game.resetGame();

        await game.updateGameState(null, "gameEnd");
      }
    } catch (error) {
      console.error(`Error resetting game in room ${roomId}:`, error);
    }
  },
  { connection, autorun: false }
);

export default resetGameWorker;
