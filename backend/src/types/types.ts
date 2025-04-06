import { Server } from "socket.io";

declare global {
  namespace Express {
    interface Request {
      user?: { userId: string };
    }
  }
}

declare module "socket.io" {
  interface Socket {
    userId?: string;
    userName?: string;
  }
}

interface UserData {
  userId: string;
  userName: string;
  userSocketId: string;
}

interface IDraw {
  isDraw: boolean;
  potSpliters: { userId: string; hand: Hand }[];
}

interface IGame {
  io: Server | null;
  roomId: string;
  tablePositions: IPlayersMap;
  minRaiseAmount: number;
  totalPot: number;
  playerTurn: IPlayer | null;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastBet: number;
  movesCount: number;
  currentRound: string;
  winner: { userId: string; hand?: Hand } | null;
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
  userId?: string;
}

interface ITime {
  startTime: Date;
  endTime: Date;
}

interface IPlayer {
  coins: number;
  playerInfo: { userId: string; userName: string };
  isDealer: boolean;
  isSmallBind: boolean;
  isBigBind: boolean;
  cards: string[];
  playerRaise: IRaise;
  playerPot: number;
  isAllIn: boolean;
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
  minStake: number;
  players: { userId: string; userName: string }[];
  gameState: IGame | null;
}

interface CreateRoomData {
  maxPlayers: number;
  roomName: string;
  minStake: number;
}

interface GetKickersArgs {
  onePair?: string;
  twoPair?: string;
  handName: string;
}

interface ITablePositionsMap {
  [key: string]: string;
}

interface IPlayersMap {
  [key: string]: ITablePositionsMap;
}

interface IUpdateGameState {
  prevPlayerId: string;
  action: PlayerAction;
}

type PlayerAction = "fold" | "check" | "raise" | "call" | "all in" | "";

type GameStatus = "inProgress" | "gameStarted" | "gameEnd";

type GetUserCallback = (userInfo: UserData | null) => void;

type CardsMap = { [key: string]: number };

type RanksMap = { [key: number]: number };

export type {
  UserData,
  GetUserCallback,
  RoomData,
  CreateRoomData,
  IGame,
  IPlayer,
  IRaise,
  ITime,
  CardsMap,
  Hand,
  RanksMap,
  GetKickersArgs,
  IDraw,
  ITablePositionsMap,
  IPlayersMap,
  IUpdateGameState,
  GameStatus,
  PlayerAction,
};
