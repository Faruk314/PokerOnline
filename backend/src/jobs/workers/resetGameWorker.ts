import { RESET_GAME_QUEUE_NAME } from "../queues/resetGameQueue";
import { retrieveGameState, saveGameState } from "../../game/methods";
import { io } from "../..";
import { Worker, Job } from "bullmq";
import connection from "../connection";

const resetGameWorker = new Worker(
  RESET_GAME_QUEUE_NAME,
  async (job: Job) => {
    const { roomId } = job.data;

    try {
      const response = await retrieveGameState(roomId, io);

      console.log("resetGameCountdown triggered!");

      if (response.status === "success" && response.gameState) {
        const game = response.gameState;

        game.resetGame();

        console.log(`Game in room ${roomId} has been reset.`);
      }
    } catch (error) {
      console.error(`Error resetting game in room ${roomId}:`, error);
    }
  },
  { connection, autorun: false }
);

export default resetGameWorker;
