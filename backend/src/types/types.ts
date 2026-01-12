import { Server } from "socket.io";
import Game from "../game/game";

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
  minRaiseDiff: number;
  totalPot: number;
  playerTurn: IPlayer | null;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastMaxBet: number;
  currentRound: string;
  potInfo: PotInfo;
  isGameOver: boolean;
  bigBlind: number;
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
  seatIndex: number;
  isDealer: boolean;
  isSmallBlind: boolean;
  isBigBlind: boolean;
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

interface IPreGameState {
  players: IPlayer[];
}
interface RoomData {
  roomId: string;
  roomName: string;
  maxPlayers: number;
  minStake: number;
  bigBlind: number;
  players: { userId: string; userName: string }[];
  gameState: IPreGameState | IGame | null;
}

interface CreateRoomData {
  maxPlayers: number;
  roomName: string;
  minStake: number;
  bigBlind: number;
}

interface GetKickersArgs {
  onePair?: string;
  twoPair?: string;
  handName: string;
}

interface ITablePositionsMap {
  [key: string]: string;
}

interface IUpdateGameState {
  prevPlayerId: string;
  action: PlayerAction;
  previousPlayerPot?: number;
  previousTotalPot?: number;
  previousRound?: string;
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

type PlayerAction = "fold" | "check" | "raise" | "call" | "all in" | "bet" | "";

type GameStatus = "inProgress" | "gameStarted" | "gameEnd";

type GetUserCallback = (userInfo: UserData | null) => void;

type CardsMap = { [key: string]: number };

type RanksMap = { [key: number]: number };

type SidePotsMap = Record<string, ISidePot>;

type PotInfo = Record<string, PotState>;

type RetrieveGameStateResult =
  | { status: "error"; gameState: null }
  | { status: "success"; gameState: IPreGameState }
  | { status: "success"; gameState: Game };

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
  IUpdateGameState,
  IResult,
  GameStatus,
  PlayerAction,
  SidePotsMap,
  PotInfo,
  IPreGameState,
  RetrieveGameStateResult,
};
