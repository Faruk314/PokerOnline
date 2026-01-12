import { Server } from "socket.io";
import {
  IGame,
  Hand,
  GameStatus,
  IUpdateGameState,
  SidePotsMap,
  IResult,
  PotInfo,
} from "../types/types";
import {
  deleteGameState,
  generateDeck,
  saveGameState,
} from "../redis/methods/game";
import { resetGameQueue } from "../jobs/queues/resetGameQueue";
import { playerTimerQueue } from "../jobs/queues/playerTimerQueue";
import { getUser } from "../redis/methods/user";
import { incrementPlayerCoins } from "../services/game";
import Player from "./player";
import { handRanks } from "../constants/constants";
import { leaveRoom } from "../redis/methods/room";

class Game {
  io: Server | null;
  roomId: string;
  totalPot: number;
  minRaiseDiff: number;
  playerTurn: Player | null;
  deck: string[];
  communityCards: string[] = [];
  players: Player[] = [];
  lastMaxBet: number = 0;
  currentRound = "preFlop";
  potInfo: PotInfo = {};
  isGameOver = false;
  bigBlind: number = 50;

  constructor({
    io,
    roomId,
    totalPot,
    minRaiseDiff,
    playerTurn,
    players,
    deck,
    communityCards,
    lastMaxBet,
    currentRound,
    potInfo,
    isGameOver,
    bigBlind,
  }: IGame) {
    this.io = io;
    this.roomId = roomId;
    this.totalPot = totalPot;
    this.minRaiseDiff = minRaiseDiff;
    this.players = players.map((player) => new Player(player));
    this.playerTurn = playerTurn
      ? this.players.find(
          (p) => p.playerInfo.userId === playerTurn.playerInfo.userId
        ) || null
      : null;
    this.deck = deck;
    this.communityCards = communityCards;
    this.lastMaxBet = lastMaxBet;
    this.currentRound = currentRound;
    this.potInfo = potInfo;
    this.isGameOver = isGameOver;
    this.bigBlind = bigBlind;
  }

  getPlayer(playerId: string) {
    const player = this.players.find((p) => p.playerInfo.userId === playerId);

    return player;
  }

  async updateGameState(
    data: IUpdateGameState | null,
    status: GameStatus = "inProgress"
  ) {
    const sockets = await this.io!.in(this.roomId).fetchSockets();
    const currentPlayerId = this.playerTurn?.playerInfo.userId;

    sockets.forEach((socket: any) => {
      const updatedGameState = { ...this } as any;
      delete updatedGameState.io;

      const isDraw = updatedGameState.potInfo["mainPot"]?.isDraw;
      const isShowdownWinner =
        updatedGameState.potInfo["mainPot"]?.winner?.hand !== null;

      const updatedPlayers = updatedGameState.players.map((player: any) => {
        if (updatedGameState.isGameOver && (isDraw || isShowdownWinner)) {
          return {
            ...player,
            cards: [...player.cards], // Show the opponents' cards when it's time
          };
        }

        if (player.playerInfo.userId === socket.userId || player.showCards) {
          return {
            ...player,
            cards: [...player.cards], // Keep the user's cards visible
          };
        }

        return {
          ...player,
          cards: ["", ""], // Hide the opponents' cards
        };
      });

      updatedGameState.players = updatedPlayers;

      if (currentPlayerId !== socket.userId) {
        const playerTurnClone = { ...updatedGameState.playerTurn };
        playerTurnClone.cards = ["", ""];
        updatedGameState.playerTurn = playerTurnClone;
      }

      if (status === "gameEnd") {
        this.io?.to(socket.id).emit("updateGame", {
          gameState: updatedGameState,
          roomId: this.roomId,
        });
      }

      if (status === "inProgress") {
        this.io!.to(socket.id).emit("updateGame", {
          gameState: updatedGameState,
          roomId: this.roomId,
          action: data?.action,
          playerId: data?.prevPlayerId,
          previousPlayerPot: data?.previousPlayerPot,
          previousTotalPot: data?.previousTotalPot,
          previousRound: data?.previousRound,
        });
      }

      if (status === "gameStarted") {
        this.io!.to(socket.id).emit("gameStarted", {
          gameState: updatedGameState,
          roomId: this.roomId,
        });
      }
    });

    const updatedGameState = { ...this } as any;
    delete updatedGameState.io;

    await saveGameState(this.roomId, updatedGameState);
  }

  async initGameOver(reason: string) {
    const lastPlayerId = this.players[0].playerInfo.userId;

    const lastPlayerCoins = this.players[0].coins;

    await incrementPlayerCoins(lastPlayerId, lastPlayerCoins);

    await deleteGameState(this.roomId);

    const lastPlayerData = await getUser(lastPlayerId);

    if (!lastPlayerData) return;

    this.io?.to(lastPlayerData?.userSocketId).emit("gameEnd", { reason });
  }

  async disconnect(playerId: string, userName: string) {
    let disconnectedPlayerCoins: number | null = null;

    this.players = this.players.filter((player) => {
      if (player.playerInfo.userId === playerId) {
        disconnectedPlayerCoins = player.coins;
        return false;
      }
      return true;
    });

    if (disconnectedPlayerCoins) {
      await incrementPlayerCoins(playerId, disconnectedPlayerCoins);
    }

    this.players = this.players.sort((a, b) => a.seatIndex - b.seatIndex);

    this.io?.to(this.roomId).emit("playerLeft", { playerId, userName });

    if (this.players.length === 1) {
      await this.initGameOver("opponentLeft");
      return;
    }

    await this.switchTurns();

    this.isRoundOver();
  }

  private async handleAllInRound() {
    switch (this.currentRound) {
      case "preFlop":
        this.lastMaxBet = 0;
        this.startFlop();
        this.startTurn();
        this.startRiver();
        break;
      case "flop":
        this.lastMaxBet = 0;
        this.startTurn();
        this.startRiver();
        break;
      case "turn":
        this.lastMaxBet = 0;
        this.startRiver();
        break;
      case "river":
        this.lastMaxBet = 0;
        break;
    }

    await this.startShowdown();
  }

  private async startNextStreet() {
    switch (this.currentRound) {
      case "preFlop":
        this.startFlop();
        break;
      case "flop":
        this.startTurn();
        break;
      case "turn":
        this.startRiver();
        break;
      case "river":
        await this.startShowdown();
        break;
    }
  }

  async isRoundOver() {
    const activePlayers = this.players.filter((p) => !p.isFold);

    if (activePlayers.length === 1) {
      const winnerId = activePlayers[0].playerInfo.userId;

      const winner = this.getPlayer(winnerId);
      winner!.coins += this.totalPot;

      this.potInfo["mainPot"] = {
        isDraw: false,
        winner: { userId: winnerId, hand: null },
        amount: this.totalPot,
      };

      this.totalPot = 0;
      this.isGameOver = true;

      await resetGameQueue.getInstance().addTimer(this.roomId);
      return;
    }

    const maxBet = Math.max(...activePlayers.map((p) => p.playerPot));

    const betsAreEqual = activePlayers.every(
      (p) => p.isAllIn || p.playerPot === maxBet
    );

    const everyoneActed = activePlayers.every(
      (p) =>
        p.isCall ||
        p.isCheck ||
        p.isAllIn ||
        (p.playerRaise.isRaise && p.playerPot === maxBet)
    );

    if (betsAreEqual && everyoneActed) {
      const playersWithChips = activePlayers.filter((p) => p.coins > 0);

      if (playersWithChips.length <= 1) {
        await this.handleAllInRound();
      } else {
        this.resetStreet();
        await this.startNextStreet();
        await this.switchTurns();
      }

      return;
    }

    await this.switchTurns();
  }

  private resetStreet() {
    this.lastMaxBet = 0;

    if (this.currentRound === "showdown") return;

    this.players.forEach((player) => {
      player.playerPot = 0;
      player.isCall = false;
      player.isCheck = false;
      player.playerRaise.isRaise = false;
      player.playerRaise.amount = 0;
    });

    this.minRaiseDiff = this.bigBlind;
  }

  private startFlop() {
    this.currentRound = "flop";

    for (let i = 0; i < 3; i++) {
      const randomCardIndex = Math.floor(Math.random() * this.deck.length);

      const card = this.deck.splice(randomCardIndex, 1);

      this.communityCards.push(...card);
    }
  }

  private startTurn() {
    this.currentRound = "turn";

    const randomCardIndex = Math.floor(Math.random() * this.deck.length);

    const card = this.deck.splice(randomCardIndex, 1);

    this.communityCards.push(...card);
  }

  private startRiver() {
    this.currentRound = "river";

    const randomCardIndex = Math.floor(Math.random() * this.deck.length);

    const card = this.deck.splice(randomCardIndex, 1);

    this.communityCards.push(...card);
  }

  private async startShowdown() {
    this.currentRound = "showdown";

    this.findHands();

    const isAllIn = this.players.some((player) => player.coins === 0);

    this.isGameOver = true;

    if (!isAllIn) {
      const handOrder = this.getHandOrder(this.players);
      const result = this.findBestHand(handOrder);

      await resetGameQueue.getInstance().addTimer(this.roomId);
      this.handlePayout(result, { potName: "mainPot", amount: this.totalPot });
    } else {
      this.handleSidePotPayout();
      await resetGameQueue.getInstance().addTimer(this.roomId);
    }
  }

  private setNextActivePlayer(playerTurnIndex: number) {
    let nextPlayerIndex = playerTurnIndex;

    for (let i = 0; i < this.players.length; i++) {
      nextPlayerIndex += 1;

      if (nextPlayerIndex > this.players.length) {
        nextPlayerIndex = 0;
      }

      const player = this.players[nextPlayerIndex];

      if (player && !player.isFold && player.coins > 0) {
        this.playerTurn = player;
        break;
      }
    }
  }

  private async startTurnTimer() {
    if (!this.playerTurn) return;

    const start = Date.now();
    const turnDuration = 300000000000000;

    this.playerTurn.time = {
      startTime: new Date(start),
      endTime: new Date(start + turnDuration),
    };

    await playerTimerQueue
      .getInstance()
      .addTimer(
        this.roomId,
        this.playerTurn.playerInfo.userId,
        this.playerTurn.time.endTime
      );
  }

  async switchTurns() {
    if (!this.playerTurn) return;

    this.playerTurn.time = null;

    let playerTurnIndex = -1;

    //Find a playerTurnIndex in a players array
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      if (player.playerInfo.userId === this.playerTurn.playerInfo.userId) {
        playerTurnIndex = i;
      }
    }

    this.setNextActivePlayer(playerTurnIndex);

    await this.startTurnTimer();
  }

  private getCommunityCardsCombinations(
    arr: string[],
    length: number
  ): string[][] {
    if (length === 1) return arr.map((d) => [d]);

    return arr.flatMap((d, i) =>
      this.getCommunityCardsCombinations(arr.slice(i + 1), length - 1).map(
        (comb) => [d, ...comb]
      )
    );
  }

  private getCardRanksMap(combination: string[]) {
    const map: {
      [key: number]: number;
    } = {};

    combination.forEach((c) => {
      const rank = this.getRank(c);

      if (map[rank]) {
        map[rank] += 1;
      } else {
        map[rank] = 1;
      }
    });

    return map;
  }

  private handPriority(playerHand: Hand, foundHand: Hand) {
    if (!playerHand) {
      return foundHand;
    }

    const playerHandIndex = handRanks.indexOf(playerHand.name);
    const foundHandIndex = handRanks.indexOf(foundHand.name);

    if (foundHandIndex > playerHandIndex) {
      return foundHand;
    }

    if (playerHandIndex > foundHandIndex) {
      return playerHand;
    }

    //finding the strongers cards out of two if we have same cards
    const strongerCards = this.isStrongerCards(playerHand, foundHand);

    return strongerCards;
  }

  private evaluateCombination(combination: string[]) {
    const flush = this.isFlush(combination);

    if (
      (flush && flush.name === "royalFlush") ||
      flush?.name === "straightFlush"
    )
      return flush;

    const rankMap = this.getCardRanksMap(combination);
    const groups: Record<number, number[]> = {};

    for (const [rankStr, count] of Object.entries(rankMap)) {
      const rank = Number(rankStr);
      if (!groups[count]) groups[count] = [];
      groups[count].push(rank);
    }

    if (groups[4]) {
      const kickers = groups[1]?.sort((a, b) => b - a) ?? [];
      return { name: "4Kind", rank: groups[4][0], kickers, cards: combination };
    }

    if (groups[3] && groups[2]) {
      return {
        name: "fullHouse",
        rank: groups[3][0],
        rankTwo: groups[2][0],
        cards: combination,
      };
    }

    if (flush && flush.name === "flush") return flush;

    const straight = this.isStraight(combination);

    if (straight && straight.name === "straight") return straight;

    if (groups[3]) {
      const kickers = groups[1]?.sort((a, b) => b - a) ?? [];
      return { name: "3Kind", rank: groups[3][0], kickers, cards: combination };
    }

    if (groups[2]?.length >= 2) {
      const pairs = groups[2].sort((a, b) => b - a);
      const kickers = groups[1]?.sort((a, b) => b - a) ?? [];
      return {
        name: "twoPair",
        rank: pairs[0],
        rankTwo: pairs[1],
        kickers,
        cards: combination,
      };
    }

    if (groups[2]) {
      const kickers = groups[1]?.sort((a, b) => b - a) ?? [];
      return {
        name: "onePair",
        rank: groups[2][0],
        kickers,
        cards: combination,
      };
    }

    const kickers = groups[1]?.sort((a, b) => b - a) ?? [];
    return { name: "highCard", rank: kickers[0], kickers, cards: combination };
  }

  private findHands() {
    const playersNotFold = this.players.filter((p) => !p.isFold);

    playersNotFold.forEach((player) => {
      const cards = [...this.communityCards, ...player.cards];
      const combinations = this.getCommunityCardsCombinations(cards, 5);

      for (const c of combinations) {
        const foundHand = this.evaluateCombination(c);

        if (foundHand && foundHand.name === "royalFlush") {
          player.hand = foundHand;
          break;
        } else {
          player.hand = this.handPriority(player.hand!, foundHand);
        }
      }
    });
  }

  private getHandOrder(players: Player[]) {
    let handOrder = [];
    const playersNotFold = players.filter((p) => !p.isFold);

    while (playersNotFold.length) {
      let currentBestHand = playersNotFold[0].hand!;
      currentBestHand.userId = playersNotFold[0].playerInfo.userId;
      currentBestHand.index = 0;

      for (let j = 1; j < playersNotFold.length; j++) {
        const nextHand = playersNotFold[j].hand!;
        nextHand.userId = playersNotFold[j].playerInfo.userId;
        nextHand.index = j;

        const betterHand = this.handPriority(currentBestHand!, nextHand!);
        currentBestHand = betterHand;
      }

      handOrder.push(currentBestHand);
      playersNotFold.splice(currentBestHand.index!, 1);
    }

    return handOrder;
  }

  private determinePotSpliters(handOrder: Hand[]) {
    let result: IResult = {
      isDraw: false,
      potSpliters: [],
      winner: { userId: "", hand: null },
    };

    for (let i = 0; i < 1; i++) {
      const hand = handOrder[i];
      const potSpliter = { userId: hand.userId!, hand: hand };
      result.potSpliters = [potSpliter];

      for (let j = 1; j < handOrder.length; j++) {
        const handTwo = handOrder[j];

        if (hand.name !== handTwo.name) {
          result.winner = { userId: hand.userId!, hand: hand };
          break;
        }

        if (hand.rank! > handTwo.rank!) {
          result.winner = { userId: hand.userId!, hand: hand };
          break;
        }

        if (hand.rankTwo && handTwo.rankTwo) {
          if (hand.rankTwo > handTwo.rankTwo) {
            result.winner = { userId: hand.userId!, hand: hand };
            break;
          }
        }

        if (
          hand.name === handTwo.name &&
          hand.strongestKicker &&
          handTwo.strongestKicker
        ) {
          if (hand.strongestKicker > handTwo.strongestKicker) {
            result.winner = { userId: hand.userId!, hand: hand };
            break;
          }

          if (handTwo.strongestKicker > hand.strongestKicker) {
            result.winner = { userId: handTwo.userId!, hand: handTwo };
            break;
          }
        }

        if (
          hand.name === handTwo.name &&
          hand.strongestKicker === handTwo.strongestKicker
        ) {
          const potSpliterTwo = { userId: handTwo.userId!, hand: handTwo };
          result.isDraw = true;
          result.potSpliters.push(potSpliterTwo);
        }
      }
    }

    return result;
  }

  private findBestHand(handOrder: Hand[]) {
    const result = this.determinePotSpliters(handOrder);

    return result;
  }

  private determineSidepots() {
    const playersNotFold = this.players
      .filter((player) => !player.isFold)
      .sort((a, b) => a.playerPot - b.playerPot);

    const minAllInAmount = playersNotFold[0].playerPot;

    const mainPot = minAllInAmount * playersNotFold.length;

    const sidePots: SidePotsMap = {};

    for (let i = 0; i < playersNotFold.length; i++) {
      const player = playersNotFold[i];
      const playerRemainingPot = player.playerPot - minAllInAmount;

      player.playerPot = player.playerPot - minAllInAmount;

      if (playerRemainingPot === 0) continue;

      for (let j = 0; j < playersNotFold.length; j++) {
        const opponent = playersNotFold[j];
        const opponentRemainingPot = opponent.playerPot - minAllInAmount;

        if (opponentRemainingPot === 0) continue;

        if (player.playerInfo.userId === opponent.playerInfo.userId) continue;

        if (player.playerPot === 0) continue;

        if (player.playerPot <= opponent.playerPot) {
          const sidePot = playerRemainingPot;

          opponent.playerPot = opponent.playerPot - playerRemainingPot;

          if (!sidePots[i]) {
            sidePots[i] = { amount: 0, players: [] };
          }

          sidePots[i].amount += sidePot;
          sidePots[i].players!.push(opponent.playerInfo.userId);

          if (j === playersNotFold.length - 1) {
            player.playerPot = player.playerPot - playerRemainingPot;
            sidePots[i].amount += sidePot;
            sidePots[i].players!.push(player.playerInfo.userId);
          }
        }
      }
    }

    return { mainPot: { amount: mainPot }, ...sidePots };
  }

  private handleSidePotPayout() {
    const sidePots: SidePotsMap = this.determineSidepots();
    const handOrder = this.getHandOrder(this.players);

    this.players.forEach((player, index) => {
      const remainingCoins = player.playerPot;

      const currentPlayer = this.players[index];

      currentPlayer.coins += remainingCoins;
      currentPlayer.playerPot -= remainingCoins;
    });

    for (const [potKey, pot] of Object.entries(sidePots)) {
      let eligiblePlayers = [];

      if (potKey === "mainPot") {
        eligiblePlayers = this.players.filter((p) => !p.isFold);
      } else {
        eligiblePlayers = pot.players!.map((id) => this.getPlayer(id));
      }

      const eligibleHandOrder = handOrder.filter((p) =>
        eligiblePlayers.some((ep) => p.userId === ep!.playerInfo.userId)
      );

      const result = this.findBestHand(eligibleHandOrder);

      this.handlePayout(result, { potName: potKey, amount: pot.amount });
    }

    this.totalPot = 0;
  }

  private handlePayout(
    result: IResult,
    potData: { potName: string; amount: number }
  ) {
    if (result.isDraw) {
      const share = potData.amount / result.potSpliters.length;

      this.potInfo[potData.potName] = {
        isDraw: true,
        potSpliters: result.potSpliters,
        amount: potData.amount,
      };

      for (const potSplitter of result.potSpliters) {
        const player = this.getPlayer(potSplitter.userId);
        player!.coins += share;
      }
    } else {
      const winner = this.getPlayer(result.winner?.userId);

      this.potInfo[potData.potName] = {
        isDraw: false,
        winner: { userId: winner!.playerInfo.userId, hand: winner!.hand },
        amount: potData.amount,
      };

      winner!.coins += potData.amount;
    }

    this.totalPot = 0;
  }

  private getSuit(card: string) {
    return card[0];
  }

  private getRank(card: string, returnLowAce: boolean = false) {
    const rank = card[1];
    const rankTwo = card[2];

    if (rank === "1" && rankTwo === "0") {
      return 10;
    }

    if (rank === "A") {
      if (returnLowAce) return 1;

      return 14;
    }

    if (rank === "J") {
      return 11;
    }

    if (rank === "Q") {
      return 12;
    }

    if (rank === "K") {
      return 13;
    }

    return parseInt(rank);
  }

  private compareKickers(handOne: Hand, handTwo: Hand) {
    if (!handOne.kickers || !handTwo.kickers) return handOne;

    for (let i = 0; i < handOne.kickers.length; i++) {
      const handOneKicker = handOne.kickers[i];
      const handTwoKicker = handTwo.kickers[i];

      if (handOneKicker === handTwoKicker) continue;

      const strongerKicker = Math.max(handOneKicker, handTwoKicker);

      if (handOneKicker === strongerKicker) {
        handOne.strongestKicker = handOneKicker;
        handTwo.strongestKicker = handTwoKicker;
        return handOne;
      }

      if (handTwoKicker === strongerKicker) {
        handTwo.strongestKicker = handTwoKicker;
        handOne.strongestKicker = handOneKicker;
        return handTwo;
      }
    }

    return handOne;
  }

  private isSameSuits(combination: string[]): boolean {
    if (combination.length === 0) return false;

    const firstSuit = this.getSuit(combination[0]);
    return combination.every((c) => this.getSuit(c) === firstSuit);
  }

  private isStrongerCards(handOne: Hand, handTwo: Hand) {
    if (handOne.rank! > handTwo.rank!) return handOne;
    if (handTwo.rank! > handOne.rank!) return handTwo;

    if (handOne.rankTwo !== undefined && handTwo.rankTwo !== undefined) {
      if (handOne.rankTwo! > handTwo.rankTwo!) return handOne;
      if (handTwo.rankTwo! > handOne.rankTwo!) return handTwo;
    }

    return this.compareKickers(handOne, handTwo);
  }

  private isConsecutive(ranks: number[]) {
    for (let i = 0; i < ranks.length - 1; i++) {
      if (ranks[i + 1] - ranks[i] !== 1) {
        return false;
      }
    }
    return true;
  }

  private isStraight(combination: string[]) {
    const ranksHigh = combination
      .map((c) => this.getRank(c))
      .sort((a, b) => a - b);

    const ranksLow = combination
      .map((c) => this.getRank(c, true))
      .sort((a, b) => a - b);

    const isConsecutiveHigh = this.isConsecutive(ranksHigh);
    const isConsecutiveLow = this.isConsecutive(ranksLow);

    if (isConsecutiveHigh || isConsecutiveLow) {
      const highestRank = isConsecutiveHigh
        ? ranksHigh[ranksHigh.length - 1]
        : ranksLow[ranksLow.length - 1];

      return {
        name: "straight",
        cards: combination,
        rank: highestRank,
      };
    }

    return false;
  }

  private isFlush(combination: string[]) {
    if (!this.isSameSuits(combination)) return;

    const ranksDescending = combination
      .map((c) => this.getRank(c))
      .sort((a, b) => b - a);

    const straight = this.isStraight(combination);

    if (straight) {
      if (straight.rank === 14 && straight.name === "straight") {
        return { name: "royalFlush", cards: combination };
      }

      return { name: "straightFlush", cards: combination, rank: straight.rank };
    }

    return {
      name: "flush",
      cards: combination,
      rank: ranksDescending[0],
      kickers: ranksDescending.slice(1),
    };
  }

  async resetGame() {
    this.deck = generateDeck();

    for (let i = this.players.length - 1; i >= 0; i--) {
      const player = this.players[i];

      if (player.coins === 0) {
        const playerData = await getUser(player.playerInfo.userId);
        if (playerData) {
          this.io?.to(playerData.userSocketId).emit("gameEnd", {
            reason: "insufficientFunds",
          });
        }

        this.players.splice(i, 1);

        await leaveRoom({
          roomId: this.roomId,
          userId: player.playerInfo.userId,
        });

        continue;
      }

      const firstRandomCardIndex = Math.floor(Math.random() * this.deck.length);
      const firstCard = this.deck.splice(firstRandomCardIndex, 1);
      const secondRandomCardIndex = Math.floor(
        Math.random() * this.deck.length
      );
      const secondCard = this.deck.splice(secondRandomCardIndex, 1);

      player.isAllIn = false;
      player.playerPot = 0;
      player.isCall = false;
      player.isFold = false;
      player.isCheck = false;
      player.hand = null;
      player.cards = [...firstCard, ...secondCard];
      player.playerRaise = { isRaise: false, amount: 0 };
      player.showCards = false;
    }

    if (this.players.length === 1) {
      return await this.initGameOver("opponentInsufficientFunds");
    }

    this.players = this.players.sort((a, b) => a.seatIndex - b.seatIndex);

    const bigBlind = this.bigBlind;
    const smallBlind = bigBlind / 2;

    this.currentRound = "preFlop";
    this.totalPot = bigBlind + smallBlind;
    this.communityCards = [];
    this.potInfo = {};
    this.isGameOver = false;
    this.lastMaxBet = bigBlind;
    this.minRaiseDiff = bigBlind;

    const dealerIndex = this.players.findIndex((p) => p.isDealer);
    const smallBlindIndex = (dealerIndex + 1) % this.players.length;
    const bigBlindIndex = (smallBlindIndex + 1) % this.players.length;

    const smallBlindPlayer = this.players[smallBlindIndex];
    smallBlindPlayer.isSmallBlind = true;

    if (smallBlindPlayer.coins <= smallBlind) {
      smallBlindPlayer.playerPot = smallBlindPlayer.coins;
      smallBlindPlayer.coins = 0;
      smallBlindPlayer.isAllIn = true;
    } else {
      smallBlindPlayer.playerPot = smallBlind;
      smallBlindPlayer.coins -= smallBlind;
    }

    const bigBlindPlayer = this.players[bigBlindIndex];
    bigBlindPlayer.isBigBlind = true;

    if (bigBlindPlayer.coins <= bigBlind) {
      bigBlindPlayer.playerPot = bigBlindPlayer.coins;
      bigBlindPlayer.coins = 0;
      bigBlindPlayer.isAllIn = true;
    } else {
      bigBlindPlayer.playerPot = bigBlind;
      bigBlindPlayer.coins -= bigBlind;
    }

    const playerTurnIndex = (smallBlindIndex + 2) % this.players.length;
    const currentPlayerTurn = this.players[playerTurnIndex];

    if (currentPlayerTurn.coins === 0) {
      this.setNextActivePlayer(playerTurnIndex);
    } else {
      this.playerTurn = currentPlayerTurn;
    }

    await this.startTurnTimer();
  }
}

export default Game;
