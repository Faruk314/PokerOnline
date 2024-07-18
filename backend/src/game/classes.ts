import {
  IPlayer,
  IGame,
  IRaise,
  CardsMap,
  Hand,
  RanksMap,
  IDraw,
} from "../types/types";
import { generateDeck } from "./methods";

const handRanks = [
  "highCard",
  "onePair",
  "twoPair",
  "3Kind",
  "straight",
  "flush",
  "fullHouse",
  "4Kind",
  "straightFlush",
  "royalFlush",
];

class Game {
  totalPot: number;
  playerTurn: Player | null;
  deck: string[];
  communityCards: string[] = [];
  players: Player[] = [];
  lastBet: number = 0;
  movesCount: number = 0;
  currentRound = "preFlop";
  winner: { userId: number; hand: Hand } | null = null;
  draw: IDraw = {
    isDraw: false,
    potSpliters: [],
  };

  constructor({
    totalPot,
    playerTurn,
    players,
    deck,
    communityCards,
    lastBet,
    movesCount,
    currentRound,
    winner,
    draw,
  }: IGame) {
    this.totalPot = totalPot;
    this.players = players.map((player) => new Player(player));
    this.playerTurn = playerTurn
      ? this.players.find(
          (p) => p.playerInfo.userId === playerTurn.playerInfo.userId
        ) || null
      : null;
    this.deck = deck;
    this.communityCards = communityCards;
    this.lastBet = lastBet;
    this.movesCount = movesCount;
    this.currentRound = currentRound;
    this.winner = winner;
    this.draw = draw;
  }

  isRoundOver() {
    this.movesCount += 1;

    if (this.movesCount === this.players.length) {
      this.movesCount = 0;
      let totalPot = 0;

      this.players.forEach((player) => {
        totalPot += player.playerPot;
        player.playerPot = 0;
        player.isCall = false;
        player.playerRaise.isRaise = false;
        player.playerRaise.amount = 0;
      });

      this.totalPot = totalPot;
      this.lastBet = 0;

      if (this.currentRound === "preFlop") return this.startFlop();

      if (this.currentRound === "flop") return this.startTurn();

      if (this.currentRound === "turn") return this.startRiver();

      if (this.currentRound === "river") return this.startShowdown();
    }
  }

  startFlop() {
    this.currentRound = "flop";

    for (let i = 0; i < 3; i++) {
      const randomCardIndex = Math.floor(Math.random() * this.deck.length);

      const card = this.deck.splice(randomCardIndex, 1);

      this.communityCards.push(...card);
    }
  }

  startTurn() {
    this.currentRound = "turn";

    const randomCardIndex = Math.floor(Math.random() * this.deck.length);

    const card = this.deck.splice(randomCardIndex, 1);

    this.communityCards.push(...card);
  }

  startRiver() {
    this.currentRound = "river";

    const randomCardIndex = Math.floor(Math.random() * this.deck.length);

    const card = this.deck.splice(randomCardIndex, 1);

    this.communityCards.push(...card);
  }

  startShowdown() {
    this.currentRound = "showdown";

    this.findHands();

    this.findBestHand();
  }

  switchTurns() {
    if (!this.playerTurn) return;
    let playerTurnIndex = -1;

    //Find a playerTurnIndex in a players array
    for (let i = 0; i < this.players.length; i++) {
      const player = this.players[i];

      if (player.playerInfo.userId === this.playerTurn.playerInfo.userId) {
        playerTurnIndex = i;
      }
    }

    let nextPlayerIndex = playerTurnIndex;

    for (let i = 0; i < this.players.length; i++) {
      nextPlayerIndex += 1;

      if (nextPlayerIndex > this.players.length) {
        nextPlayerIndex = 0;
      }

      const player = this.players[nextPlayerIndex];

      if (player && !player.isFold) {
        this.playerTurn = player;
        break;
      }
    }
  }

  getCommunityCardsCombinations(arr: string[], length: number): string[][] {
    if (length === 1) return arr.map((d) => [d]);

    return arr.flatMap((d, i) =>
      this.getCommunityCardsCombinations(arr.slice(i + 1), length - 1).map(
        (comb) => [d, ...comb]
      )
    );
  }

  getCardsMap(combination: string[]) {
    let map: CardsMap = {};

    combination.forEach((c) => {
      if (map[c]) {
        map[c] += 1;
      } else {
        map[c] = 1;
      }
    });

    return map;
  }

  getCardRanksMap(combination: string[]) {
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

  getCardSuitsMap(combination: string[]) {
    const map: {
      [key: string]: number;
    } = {};

    combination.forEach((c) => {
      const suit = this.getSuit(c);

      if (map[suit]) {
        map[suit] += 1;
      } else {
        map[suit] = 1;
      }
    });

    return map;
  }

  handPriority(playerHand: Hand, foundHand: Hand) {
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

  findHands() {
    this.players.forEach((player) => {
      const cards = [...this.communityCards, ...player.cards];
      const playerCardCombinations = this.getCommunityCardsCombinations(
        cards,
        5
      );

      console.log(playerCardCombinations, "p card comb");

      playerCardCombinations.forEach((c) => {
        const nKind = this.isNKind(c);
        const pair = this.isPair(c);
        const flush = this.isFlush(c);
        const fullHouse = this.isFullHouse(c);
        const straight = this.isStraight(c);
        const highCard = this.isHighCard(c);

        if (flush) {
          player.hand = this.handPriority(player.hand!, flush);
        }

        if (fullHouse) {
          player.hand = this.handPriority(player.hand!, fullHouse);
        }

        if (straight) {
          player.hand = this.handPriority(player.hand!, straight);
        }

        if (nKind) {
          player.hand = this.handPriority(player.hand!, nKind);
        }

        if (pair) {
          player.hand = this.handPriority(player.hand!, pair);
        }

        if (highCard) {
          player.hand = this.handPriority(player.hand!, highCard);
        }
      });
    });
  }

  findBestHand() {
    const handOrder: Hand[] = [];

    for (let i = 0; i < this.players.length; i++) {
      if (this.players[i].isFold) continue;

      const firstHand = this.players[i].hand;
      firstHand!.userId = this.players[i].playerInfo.userId;

      for (let j = 0; j < this.players.length; j++) {
        if (i === j || this.players[j].isFold) continue;

        const nextHand = this.players[j].hand;

        nextHand!.userId = this.players[j].playerInfo.userId;

        const betterHand = this.handPriority(firstHand!, nextHand!);

        if (!handOrder.some((hand) => hand.userId === betterHand.userId)) {
          handOrder.push(betterHand);
        }
      }
    }

    console.log(handOrder, "hand order");

    if (handOrder.length === 1) {
      console.log(handOrder[0], "winner length 1");
      return (this.winner = {
        userId: handOrder[0].userId!,
        hand: handOrder[0],
      });
    }

    for (let i = 0; i < 1; i++) {
      const hand = handOrder[i];
      const potSpliter = { userId: hand.userId!, hand: hand };
      this.draw.potSpliters = [potSpliter];

      for (let j = 1; j < handOrder.length; j++) {
        const handTwo = handOrder[j];

        if (hand.name !== handTwo.name) {
          this.winner = { userId: hand.userId!, hand: hand };
          break;
        }

        if (hand.name === handTwo.name && hand.kicker && handTwo.kicker) {
          if (hand.kicker > handTwo.kicker) {
            this.winner = { userId: hand.userId!, hand: hand };
            break;
          }

          if (handTwo.kicker > hand.kicker) {
            this.winner = { userId: handTwo.userId!, hand: handTwo };
            break;
          }
        }

        if (hand.name === handTwo.name && hand.kicker === handTwo.kicker) {
          const potSpliterTwo = { userId: handTwo.userId!, hand: handTwo };

          this.draw.isDraw = true;
          this.draw.potSpliters.push(potSpliterTwo);
        }
      }
    }

    console.log(this.winner, "winner");
    console.log(this.draw.potSpliters[0], this.draw.potSpliters[1], "pot");
  }

  getSuit(card: string) {
    return card[0];
  }

  getRank(card: string, returnLowAce: boolean = false) {
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

  getKickers(rankMap: RanksMap) {
    let kickers = [];

    for (const [key, value] of Object.entries(rankMap)) {
      if (value === 1) {
        const kicker = parseInt(key);
        kickers.push(kicker);
      }
    }

    return kickers.sort((a, b) => b - a);
  }

  compareKickers(handOne: Hand, handTwo: Hand) {
    if (!handOne.kickers || !handTwo.kickers) return handOne;

    for (let i = 0; i < handOne.kickers.length; i++) {
      const handOneKicker = handOne.kickers[i];
      const handTwoKicker = handTwo.kickers[i];

      if (handOneKicker === handTwoKicker) continue;

      const strongerKicker = Math.max(handOneKicker, handTwoKicker);

      if (handOneKicker === strongerKicker) {
        handOne.kicker = handOneKicker;
        return handOne;
      }

      if (handTwoKicker === strongerKicker) {
        handTwo.kicker = handTwoKicker;
        return handTwo;
      }
    }

    //we will later return draw here
    return handOne;
  }

  isSameSuits(combination: string[]) {
    let ranks: number[] = [];
    const firstSuit = this.getSuit(combination[0]);

    combination.forEach((c) => {
      let suit = this.getSuit(c + 1);
      let rank = this.getRank(c);

      if (suit !== firstSuit) {
        return false;
      }

      ranks.push(rank);
    });

    if (ranks.length !== 5) return false;

    return ranks;
  }

  isStrongerCards(handOne: Hand, handTwo: Hand) {
    let strongerHand: Hand | null = null;

    //case when we only have one rank is the case of one pair
    if (handOne.rank! > handTwo.rank!) {
      return handOne;
    }

    if (handTwo.rank! > handOne.rank!) {
      return handTwo;
    }

    //this is a case when we have ex (onePair, 4Kind, 3Kind, straight, straight flush, flush) and we dont have a rankTwo
    if (!handOne.rankTwo || !handTwo.rankTwo) {
      strongerHand = this.compareKickers(handOne, handTwo);

      //we also need to handle the draw in here
      return strongerHand;
    }

    //this is a case when we have ex (twoPair) and we have a rankTwo
    if (handOne.rankTwo! > handTwo.rankTwo!) {
      return handOne;
    }

    if (handTwo.rankTwo! > handOne.rankTwo!) {
      return handTwo;
    }

    strongerHand = this.compareKickers(handOne, handTwo);

    return strongerHand;

    //later we will handle the case where the pairs and kickers of these cards are same
  }

  isConsecutive(ranks: number[]) {
    for (let i = 0; i < ranks.length - 1; i++) {
      if (ranks[i + 1] - ranks[i] !== 1) {
        return false;
      }
    }
    return true;
  }

  isNKind(combination: string[]) {
    const rankMap = this.getCardRanksMap(combination);
    let fourOfAKindRank: null | number = null;
    let threeOfAKindRank: null | number = null;

    Object.entries(rankMap).forEach(([key, value]) => {
      const rank = parseInt(key);

      if (value === 4) {
        fourOfAKindRank = rank;
        return;
      } else if (value === 3) {
        threeOfAKindRank = rank;
      }
    });

    if (fourOfAKindRank) {
      const kickers = this.getKickers(rankMap);

      return {
        name: "4Kind",
        cards: combination,
        rank: fourOfAKindRank,
        kickers,
      };
    }

    if (threeOfAKindRank) {
      const kickers = this.getKickers(rankMap);

      return {
        name: "3Kind",
        cards: combination,
        rank: threeOfAKindRank,
        kickers,
      };
    }

    return false;
  }

  isPair(combination: string[]) {
    const rankMap = this.getCardRanksMap(combination);
    let onePair: number | null = null;
    let twoPair: number | null = null;

    for (const [key, value] of Object.entries(rankMap)) {
      if (value === 2 && !onePair) {
        onePair = parseInt(key);
        continue;
      }

      if (value === 2 && onePair) {
        twoPair = parseInt(key);

        break;
      }
    }

    if (onePair && twoPair) {
      const kickers = this.getKickers(rankMap);

      if (!kickers) return;

      return {
        name: "twoPair",
        cards: combination,
        kickers,
        rank: Math.max(onePair, twoPair),
        rankTwo: Math.min(onePair, twoPair),
      };
    }

    if (onePair) {
      const kickers = this.getKickers(rankMap);

      return {
        name: "onePair",
        cards: combination,
        rank: onePair,
        kickers,
      };
    }
  }

  isFlush(combination: string[]) {
    let ranks = this.isSameSuits(combination);

    if (!ranks) return;

    const sorted = ranks.sort((a, b) => a - b);

    const isRoyalFlush =
      sorted[0] === 10 &&
      sorted[1] === 11 &&
      sorted[2] === 12 &&
      sorted[3] === 13 &&
      sorted[4] === 14;

    if (isRoyalFlush) {
      return {
        name: "royalFlush",
        cards: combination,
      };
    }

    let isConsecutive = this.isConsecutive(sorted);

    const lowAceIndex = sorted.findIndex((rank) => rank === 14);

    const copy = [...sorted];

    copy[lowAceIndex] = 1;

    let resorted = copy.sort((a, b) => a - b);

    let isConsecutiveLowAce = this.isConsecutive(resorted);

    if (isConsecutive || isConsecutiveLowAce) {
      let highestRank = null;

      if (isConsecutive) {
        highestRank = sorted[sorted.length - 1];
      }

      if (isConsecutiveLowAce) {
        highestRank = resorted[resorted.length - 1];
      }

      if (isConsecutive && isConsecutiveLowAce) {
        highestRank = sorted[sorted.length - 1];
      }

      return {
        name: "straightFlush",
        cards: combination,
        rank: highestRank,
      };
    }

    if (!isConsecutive) {
      const highestRank = sorted[sorted.length - 1];
      sorted.splice(sorted.length - 1, 1).sort((a, b) => b - a);

      return {
        name: "flush",
        cards: combination,
        rank: highestRank,
        kickers: sorted,
      };
    }
  }

  isFullHouse(combination: string[]) {
    const rankMap = this.getCardRanksMap(combination);
    let threeOfAKind = null;
    let pair = null;

    Object.entries(rankMap).forEach(([key, value]) => {
      if (value === 3) {
        threeOfAKind = parseInt(key);
      }

      if (value === 2) {
        pair = parseInt(key);
      }
    });

    if (threeOfAKind && pair) {
      return {
        name: "fullHouse",
        cards: combination,
        rank: threeOfAKind,
        rankTwo: pair,
      };
    }
  }

  isStraight(combination: string[]) {
    const isSameSuit = this.isSameSuits(combination);

    if (isSameSuit) return false;

    const ranks = combination.map((c) => this.getRank(c));

    const sorted = ranks.sort((a, b) => a - b);

    const isConsecutive = this.isConsecutive(sorted);

    const lowAceIndex = sorted.findIndex((rank) => rank === 14);

    const copy = [...sorted];

    copy[lowAceIndex] = 1;

    let resorted = copy.sort((a, b) => a - b);

    let isConsecutiveLowAce = this.isConsecutive(resorted);

    if (isConsecutive || isConsecutiveLowAce) {
      let highestRank = null;

      if (isConsecutive) {
        highestRank = sorted[sorted.length - 1];
      }

      if (isConsecutiveLowAce) {
        highestRank = resorted[resorted.length - 1];
      }

      if (isConsecutive && isConsecutiveLowAce) {
        highestRank = sorted[sorted.length - 1];
      }

      return {
        name: "straight",
        cards: combination,
        rank: highestRank,
      };
    }

    return false;
  }

  isHighCard(combination: string[]) {
    const ranks = combination.map((card) => this.getRank(card));

    ranks.sort((a, b) => b - a);

    const highestCard = ranks[0];

    ranks.splice(0, 1);

    return {
      name: "highCard",
      cards: combination,
      rank: highestCard,
      kickers: ranks,
    };
  }

  resetGame() {
    this.deck = generateDeck();

    this.players.forEach((player) => {
      const firstRandomCardIndex = Math.floor(Math.random() * this.deck.length);
      const firstCard = this.deck.splice(firstRandomCardIndex, 1);
      const secondRandomCardIndex = Math.floor(
        Math.random() * this.deck.length
      );
      const secondCard = this.deck.splice(secondRandomCardIndex, 1);

      player.playerPot = 0;
      player.isCall = false;
      player.isFold = false;
      player.isCheck = false;
      player.hand = null;
      player.cards = [...firstCard, ...secondCard];
      player.playerRaise = {
        isRaise: false,
        amount: 0,
      };
    });

    const bigBindAmount = 50;
    this.currentRound = "preFlop";
    this.totalPot = 0;
    this.communityCards = [];
    this.winner = null;
    this.lastBet = 0;
    this.draw = {
      isDraw: false,
      potSpliters: [],
    };
    this.movesCount = 0;

    const currentDealerIndex = this.players.findIndex(
      (player) => player.isDealer
    );

    const smallBindIndex = (currentDealerIndex + 1) % this.players.length;

    this.players[smallBindIndex].isSmallBind = true;
    this.players[smallBindIndex].playerPot = bigBindAmount / 2;
    this.players[smallBindIndex].coins -= bigBindAmount / 2;

    const bigBindIndex = (smallBindIndex + 1) % this.players.length;

    this.players[bigBindIndex].isBigBind = true;
    this.players[bigBindIndex].playerPot = bigBindAmount;
    this.players[bigBindIndex].coins -= bigBindAmount;

    const playerTurnIndex = (smallBindIndex + 2) % this.players.length;

    this.lastBet = bigBindAmount;
    this.playerTurn = this.players[playerTurnIndex];
  }
}

class Player {
  coins: number;
  playerInfo: { userId: number; userName: string };
  isDealer: boolean;
  isSmallBind: boolean;
  isBigBind: boolean;
  cards: string[] = [];
  isFold: boolean = false;
  isCall: boolean = false;
  isCheck: boolean = false;
  playerPot = 0;
  playerRaise: IRaise = {
    isRaise: false,
    amount: 0,
  };
  hand: Hand | null = null;

  constructor({
    coins,
    playerInfo,
    isDealer,
    isSmallBind,
    isBigBind,
    playerPot,
    playerRaise,
    isFold,
    isCall,
    isCheck,
    cards,
    hand,
  }: IPlayer) {
    this.coins = coins;
    this.playerInfo = playerInfo;
    this.isDealer = isDealer;
    this.isSmallBind = isSmallBind;
    this.isBigBind = isBigBind;
    this.playerPot = playerPot;
    this.playerRaise = playerRaise;
    this.isFold = isFold;
    this.isCall = isCall;
    this.cards = cards;
    this.isCheck = isCheck;
    this.hand = hand;
  }

  fold() {
    this.isFold = true;
  }

  raise(amount: number) {
    this.playerPot += amount;
    this.coins -= amount;
    this.playerRaise = {
      isRaise: true,
      amount: amount,
    };
  }

  call(amount: number) {
    this.playerPot += amount;
    this.coins -= amount;
    this.isCall = true;
  }

  check() {
    this.isCheck = true;
  }
}

export { Game, Player };

// const testCombinations = [
//   // Three of a Kind Examples
//   ["HA", "DA", "CA", "H2", "S3"], // Three Aces with Two and Three kickers
//   ["HQ", "SQ", "CQ", "H9", "D5"], // Three Queens with Nine and Five kickers
//   ["HQ", "DQ", "CQ", "HJ", "SJ"], //full house
//   ["HA", "D2", "C3", "S4", "H5"], //straight
//   ["HK", "DK", "CK", "H10", "S4"], // Three Kings with Ten and Four kickers
//   ["H7", "D7", "C7", "S3", "H4"], // Three Sevens with Three and Four kickers
//   ["H9", "D9", "C9", "H7", "S6"], // Three Nines with Seven and Six kickers

//   ["H5", "D6", "C7", "S8", "H9"], //straight
//   ["HA", "DA", "CA", "HK", "SK"], //full house
//   ["HA", "H2", "H3", "H4", "H5"], //straight flush
// ];

// const arr = testCombinations.map((c) => {
//   // const cardsMap = this.getCardsMap(c);
//   const nKind = this.isNKind(c);
//   const pair = this.isPair(c);
//   const flush = this.isFlush(c);
//   const fullHouse = this.isFullHouse(c);
//   const straight = this.isStraight(c);

//   if (flush) {
//     return flush;
//   }

//   if (fullHouse) {
//     return fullHouse;
//   }

//   if (straight) {
//     return straight;
//   }

//   if (nKind) {
//     return nKind;
//   }

//   if (pair) {
//     return pair;
//   }
// });

// console.log(arr);
