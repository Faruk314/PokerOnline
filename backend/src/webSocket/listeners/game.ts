import { Server, Socket } from "socket.io";
import { retrieveGameState, saveGameState } from "../../redis/methods/game";
import { playerTimerQueue } from "../../jobs/queues/playerTimerQueue";
import Game from "../../game/game";

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

    if (!(game instanceof Game))
      return console.error("gameState is not an instance of game");

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

    const previousPlayerPot = playerTurn.playerPot;
    const previousPlayerCoins = playerTurn.coins;

    playerTurn.fold();

    const previousTotalPot = game.totalPot;
    const previousRound = game.currentRound;

    await game.isRoundOver();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action: "fold",
      previousPlayerPot,
      previousPlayerCoins,
      previousTotalPot,
      previousRound,
    });
  }

  async onPlayerRaise({ roomId, amount }: { roomId: string; amount: number }) {
    const response = await retrieveGameState(roomId, this.io);
    if (response.status !== "success" || !response.gameState) return;

    const game = response.gameState;

    if (!(game instanceof Game))
      return console.error("gameState is not an instance of game");

    const playerTurn = game.playerTurn;
    if (!playerTurn) return;

    if (game.isGameOver) {
      return console.log("Invalid raise: game is over");
    }

    if (playerTurn.playerInfo.userId !== this.socket.userId) {
      return console.log("Invalid raise: not your turn");
    }

    let minRaiseAmount = game.lastMaxBet + game.minRaiseDiff;

    if (minRaiseAmount > playerTurn.coins) {
      minRaiseAmount = playerTurn.coins;
    }

    const isAllin = amount === playerTurn.coins;

    if (amount < minRaiseAmount)
      return console.log("Invalid raise: less than minimal raise amount");

    if (amount > playerTurn.coins)
      return console.log("Invalid raise: not enough chips");

    const chipsToPutIn = isAllin ? amount : amount - playerTurn.playerPot;

    const raiseDiff = amount - game.lastMaxBet;

    const isFullRaise = raiseDiff >= game.minRaiseDiff;

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    if (isFullRaise) game.minRaiseDiff = raiseDiff;

    const previousMaxBet = game.lastMaxBet;

    game.lastMaxBet = amount;

    if (isAllin) game.lastMaxBet = amount + playerTurn.playerPot;

    let action = playerTurn.raise(chipsToPutIn);

    if (previousMaxBet === 0 && action !== "all in") {
      action = "bet";
    }

    game.totalPot += chipsToPutIn;

    const raiserId = playerTurn.playerInfo.userId;

    game.players.forEach((p) => {
      if (p.playerInfo.userId !== raiserId) {
        p.isCall = false;
        p.isCheck = false;
        p.playerRaise.isRaise = false;
      }
    });

    playerTurn.playerRaise.isRaise = true;

    await game.switchTurns();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action,
    });
  }

  async onPlayerCall({ roomId, amount }: { roomId: string; amount: number }) {
    const response = await retrieveGameState(roomId, this.io);
    if (response.status !== "success" || !response.gameState) return;

    const game = response.gameState;

    if (!(game instanceof Game))
      return console.error("gameState is not an instance of game");

    const playerTurn = game.playerTurn;

    if (!playerTurn) return;

    if (game.isGameOver) return console.log("Invalid call: game over");

    if (playerTurn.playerInfo.userId !== this.socket.userId)
      return console.log("Invalid call: not your turn");

    let callAmount = Math.max(0, game.lastMaxBet - playerTurn.playerPot);

    const isAllInCall = playerTurn.coins <= callAmount;

    if (isAllInCall) callAmount = playerTurn.coins;

    if (amount !== callAmount) return console.log("Invalid call amount");

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    const previousPlayerPot = playerTurn.playerPot + callAmount;

    const action = playerTurn.call(callAmount);

    game.totalPot += callAmount;

    const previousPlayerCoins = playerTurn.coins;
    const previousTotalPot = game.totalPot;
    const previousRound = game.currentRound;

    await game.isRoundOver();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action,
      previousPlayerPot,
      previousPlayerCoins,
      previousTotalPot,
      previousRound,
    });
  }

  async onPlayerCheck({ roomId }: { roomId: string }) {
    const response = await retrieveGameState(roomId, this.io);
    if (response.status !== "success" || !response.gameState) return;

    const game = response.gameState;

    if (!(game instanceof Game))
      return console.error("gameState is not an instance of game");

    const playerTurn = game.playerTurn;
    if (!playerTurn) return;

    if (game.isGameOver) return console.log("Invalid check: game over");

    if (playerTurn.playerInfo.userId !== this.socket.userId)
      return console.log("Invalid check: not your turn");

    const callAmount = game.lastMaxBet - playerTurn.playerPot;

    const canCheck = callAmount <= 0;
    if (!canCheck) return console.log("Invalid check: must call or raise");

    await playerTimerQueue
      .getInstance()
      .removeTimer(roomId, playerTurn.playerInfo.userId);

    const previousPlayerPot = playerTurn.playerPot;
    const previousPlayerCoins = playerTurn.coins;

    playerTurn.check();

    const previousTotalPot = game.totalPot;
    const previousRound = game.currentRound;

    await game.isRoundOver();

    await game.updateGameState({
      prevPlayerId: this.socket.userId,
      action: "check",
      previousPlayerPot,
      previousPlayerCoins,
      previousTotalPot,
      previousRound,
    });
  }

  async onPlayerShowCards({ roomId }: { roomId: string }) {
    const response = await retrieveGameState(roomId, this.io);

    if (response.status !== "success") return;

    if (!response.gameState) return;

    if (!this.socket.userId)
      return console.error("Invalid action. user does not exist");

    const game = response.gameState;

    if (!(game instanceof Game))
      return console.error("gameState is not an instance of game");

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

    await saveGameState(roomId, game);

    this.io
      .to(roomId)
      .emit("showCards", { playerId: winner.userId, cards: player.cards });
  }
}

export default GameListeners;
