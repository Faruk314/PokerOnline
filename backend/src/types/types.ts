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

interface PotState {
  isDraw: boolean;
  potSpliters?: { userId: string; hand: Hand }[];
  winner?: { userId: string; hand: Hand | null };
  amount: number;
}

interface IGame {
  io: Server | null;
  roomId: string;
  tablePositions: IPlayersMap;
  minRaiseDiff: number;
  totalPot: number;
  playerTurn: IPlayer | null;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastMaxBet: number;
  movesCount: number;
  currentRound: string;
  potInfo: PotInfo;
  isGameOver: boolean;
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
  strongestKicker?: number;
  kickers?: number[] | null;
  userId?: string;
  index?: number;
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
  showCards: boolean;
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

interface IResult {
  isDraw: boolean;
  potSpliters: { userId: string; hand: Hand }[];
  winner: { userId: string; hand: Hand | null };
}

interface ISidePot {
  amount: number;
  players?: string[];
}

type PlayerAction = "fold" | "check" | "raise" | "call" | "all in" | "";

type GameStatus = "inProgress" | "gameStarted" | "gameEnd";

type GetUserCallback = (userInfo: UserData | null) => void;

type CardsMap = { [key: string]: number };

type RanksMap = { [key: number]: number };

type SidePotsMap = Record<string, ISidePot>;

type PotInfo = Record<string, PotState>;

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
  ITablePositionsMap,
  IPlayersMap,
  IUpdateGameState,
  IResult,
  GameStatus,
  PlayerAction,
  SidePotsMap,
  PotInfo,
};
