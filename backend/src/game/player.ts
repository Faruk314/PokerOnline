import { IRaise, Hand, ITime, IPlayer, PlayerAction } from "../types/types";

class Player {
  coins: number;
  playerInfo: { userId: string; userName: string };
  seatIndex: number;
  isDealer: boolean;
  isSmallBind: boolean;
  isBigBind: boolean;
  cards: string[] = [];
  isAllIn: boolean = false;
  isFold: boolean = false;
  isCall: boolean = false;
  isCheck: boolean = false;
  playerRaise: IRaise = {
    isRaise: false,
    amount: 0,
  };
  playerPot = 0;
  hand: Hand | null = null;
  time: ITime | null = null;
  showCards = false;

  constructor({
    coins,
    playerInfo,
    seatIndex,
    isDealer,
    isSmallBind,
    isBigBind,
    playerPot,
    isAllIn,
    playerRaise,
    isFold,
    isCall,
    isCheck,
    cards,
    hand,
    time,
    showCards,
  }: IPlayer) {
    this.coins = coins;
    this.playerInfo = playerInfo;
    this.seatIndex = seatIndex;
    this.isDealer = isDealer;
    this.isSmallBind = isSmallBind;
    this.isBigBind = isBigBind;
    this.playerPot = playerPot;
    this.playerRaise = playerRaise;
    this.isAllIn = isAllIn;
    this.isFold = isFold;
    this.isCall = isCall;
    this.cards = cards;
    this.isCheck = isCheck;
    this.hand = hand;
    this.time = time;
    this.showCards = showCards;
  }

  fold() {
    this.isFold = true;
    this.isCall = false;
    this.isCheck = false;
    this.playerRaise.isRaise = false;
    this.playerRaise.amount = 0;
    this.time = null;
  }

  raise(amount: number): PlayerAction {
    this.playerPot += amount;
    this.coins -= amount;
    this.isCheck = false;
    this.isCall = false;
    this.time = null;
    this.playerRaise = {
      isRaise: true,
      amount: amount,
    };

    if (this.coins === 0) {
      this.isAllIn = true;
      return "all in";
    }

    return "raise";
  }

  call(amount: number): PlayerAction {
    this.playerPot += amount;
    this.coins -= amount;
    this.isCall = true;
    this.isCheck = false;
    this.playerRaise.isRaise = false;
    this.playerRaise.amount = 0;
    this.time = null;

    if (this.coins === 0) {
      this.isAllIn = true;

      return "all in";
    }

    return "call";
  }

  check() {
    this.isCheck = true;
    this.isCall = false;
    this.playerRaise.isRaise = false;
    this.playerRaise.amount = 0;
    this.time = null;
  }
}

export default Player;
