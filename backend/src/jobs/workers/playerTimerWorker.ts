import { PLAYER_TIMER_QUEUE_NAME } from "../queues/playerTimerQueue";
import { retrieveGameState, saveGameState } from "../../game/methods";
import { io } from "../..";
import { Worker, Job } from "bullmq";
import connection from "../connection";

const playerTimerWorker = new Worker(
  PLAYER_TIMER_QUEUE_NAME,
  async (job: Job) => {
    const { roomId, playerId } = job.data;

    try {
      const response = await retrieveGameState(roomId, io);

      if (response.status !== "success" || !response.gameState) return;

      const playerTurn = response.gameState.playerTurn;
      const game = response.gameState;

      if (!playerTurn?.time) return;

      playerTurn.fold();

      await game.isRoundOver();

      await game.updateGameState({
        prevPlayerId: playerId,
        action: "fold",
      });
    } catch (error) {
      console.error(
        `Error processing job for player ${playerId} in room ${roomId}:`,
        error
      );
    }
  },
  { connection, autorun: false }
);

export default playerTimerWorker;
