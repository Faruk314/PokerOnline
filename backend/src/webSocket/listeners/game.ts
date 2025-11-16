import { Server, Socket } from "socket.io";
import { retrieveGameState } from "../../redis/methods/game";
import { playerTimerQueue } from "../../jobs/queues/playerTimerQueue";

class GameListeners {
  io: Server;
  socket: Socket;

  constructor(io: Server, socket: Socket) {
    this.io = io;
    this.socket = socket;
  }

  registerListeners() {
    this.socket.on("playerFold", this.onPlayerFold.bind(this));
    this.socket.on("playerRaise", this.onPlayerRaise.bind(this));
    this.socket.on("playerCall", this.onPlayerCall.bind(this));
    this.socket.on("playerCheck", this.onPlayerCheck.bind(this));
    this.socket.on("playerShowCards", this.onPlayerShowCards.bind(this));
  }

  async onPlayerFold({ roomId }: { roomId: string }) {
    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (!playerTurn) return;

    if (game.isGameOver) {
      return console.log("Invalid fold");
    }

    if (playerTurn.playerInfo.userId !== this.socket.userId)
      return console.log("Current player is not on a move");

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    playerTurn.fold();

    await game.isRoundOver();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action: "fold",
    });
  }

  async onPlayerRaise({ roomId, amount }: { roomId: string; amount: number }) {
    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (!playerTurn) return;

    if (game.isGameOver) {
      return console.log("Invalid raise");
    }

    if (playerTurn.playerInfo.userId !== this.socket.userId)
      return console.log("Current player is not on a move");

    if (amount < game.minRaiseAmount || amount > game.playerTurn?.coins!)
      return console.log("Invalid raise amount!");

    const allIn = game.players.some((p) => p.coins === 0);

    if (allIn)
      return console.log("Could not raise. Previous player went all in");

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    const action = playerTurn.raise(amount);

    game.lastBet = playerTurn.playerPot;

    game.totalPot += amount;

    game.minRaiseAmount = amount * 2;

    game.movesCount = 1;

    await game.switchTurns();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action,
    });
  }

  async onPlayerCall({ roomId, amount }: { roomId: string; amount: number }) {
    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (!playerTurn) return;

    if (game.isGameOver) {
      return console.log("Invalid call");
    }

    if (playerTurn.playerInfo.userId !== this.socket.userId)
      return console.log("Current player is not on a move");

    let callAmount = game.lastBet - playerTurn.playerPot;

    if (callAmount > playerTurn.coins) {
      callAmount = playerTurn.coins;
    }

    const allIn = game.players.some((p) => p.isAllIn);

    if (allIn) {
      callAmount = playerTurn.coins;
    }

    if (amount !== callAmount) return console.log("Invalid call amount");

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    const action = playerTurn.call(amount);

    game.totalPot += amount;

    await game.isRoundOver();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action,
    });
  }

  async onPlayerCheck({ roomId }: { roomId: string }) {
    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    const playerTurn = game.playerTurn;

    if (!playerTurn) return;

    if (game.isGameOver) {
      return console.log("Invalid check");
    }

    if (playerTurn.playerInfo.userId !== this.socket.userId)
      return console.log("Current player is not on a move");

    const callAmount = game.lastBet - playerTurn.playerPot;

    const canCheck = callAmount <= 0;

    if (!canCheck) return console.log("Invalid check");

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    playerTurn.check();

    await game.isRoundOver();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action: "check",
    });
  }

  async onPlayerShowCards({ roomId }: { roomId: string }) {
    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    const game = response.gameState;

    if (!game.isGameOver) {
      return console.log("Invalid card show");
    }

    const winner = game.potInfo?.mainPot?.winner;

    if (this.socket.userId !== winner?.userId) {
      return console.log("Invalid card show");
    }

    const player = game.getPlayer(winner?.userId!);

    if (!player) return console.error("player does not exist");

    player.showCards = true;

    await game.updateGameState(null);
  }
}

export default GameListeners;
