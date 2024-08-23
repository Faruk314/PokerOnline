interface VerifiedToken {
  userId: number;
  userName: string;
}

interface UserData {
  userId: number;
  userName: string;
  userSocketId: string;
}

interface IDraw {
  isDraw: boolean;
  potSpliters: { userId: number; hand: Hand }[];
}

interface IGame {
  totalPot: number;
  playerTurn: IPlayer | null;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastBet: number;
  movesCount: number;
  currentRound: string;
  winner: { userId: number; hand?: Hand } | null;
  draw: IDraw;
}

interface IRaise {
  amount: number;
  isRaise: boolean;
}

interface Hand {
  name: string;
  cards: string[];
  rank?: number | null;
  rankTwo?: number | null;
  kicker?: number;
  kickers?: number[] | null;
  userId?: number;
}

interface ITime {
  startTime: Date;
  endTime: Date;
}

interface IPlayer {
  coins: number;
  playerInfo: { userId: number; userName: string };
  isDealer: boolean;
  isSmallBind: boolean;
  isBigBind: boolean;
  cards: string[];
  playerRaise: IRaise;
  playerPot: number;
  isFold: boolean;
  isCall: boolean;
  isCheck: boolean;
  hand: Hand | null;
  time: ITime | null;
}

interface RoomData {
  roomId: string;
  roomName: string;
  maxPlayers: number;
  players: { userId: number; userName: string }[];
  gameState: IGame | null;
}

interface GetKickersArgs {
  onePair?: string;
  twoPair?: string;
  handName: string;
}

declare module "socket.io" {
  interface Socket {
    userId?: number;
    userName?: string;
  }
}

type GetUserCallback = (userInfo: UserData | null) => void;

type CardsMap = { [key: string]: number };

type RanksMap = { [key: number]: number };

export type {
  VerifiedToken,
  UserData,
  GetUserCallback,
  RoomData,
  IGame,
  IPlayer,
  IRaise,
  ITime,
  CardsMap,
  Hand,
  RanksMap,
  GetKickersArgs,
  IDraw,
};
