interface UserData {
  userName?: string;
  email: string;
  password: string;
}

interface AuthResponse {
  status: boolean;
  userInfo: UserInfo;
}

interface GameRoom {
  roomId: string;
  roomName: string;
  maxPlayers: number;
  minStake: number;
  players: [];
}

interface IDraw {
  isDraw: boolean;
  potSpliters: { userId: string; hand: Hand }[];
}

interface IActionAnimation {
  state: "fold" | "check" | "raise" | "call" | "all in" | null;
  playerId: string | null;
}

interface IGame {
  roomId: string;
  totalPot: number;
  tablePositions: IPlayersMap;
  minRaiseAmount: number;
  playerTurn: IPlayer;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastBet: number;
  currentRound: string;
  winner: { userId: string; hand: Hand };
  draw: IDraw;
}

interface IRaise {
  isRaise: boolean;
  amount: number;
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
  isAllIn: boolean;
  isFold: boolean;
  isCall: boolean;
  isCheck: boolean;
  playerPot: number;
  playerRaise: IRaise;
  hand: Hand | null;
  time: ITime | null;
}

interface UserInfo {
  userId: string;
  userName: string;
  email: string;
  image: string;
}

interface IPlayerMoveArgs {
  gameState: IGame;
  roomId: string;
  action: string;
  playerId: string;
}

interface IGameEndData {
  reason: TGameEndReason;
}

interface ShopPackage {
  packageId: string;
  amount: number;
  price: number;
}

interface IGameStatus {
  isGameOver: boolean;
  reason: TGameEndReason | null;
}

type TGameEndReason =
  | "opponentLeft"
  | "insufficientFunds"
  | "opponentInsufficientFunds";

type TRoomJoinDenied = "insufficientFunds" | "roomFull" | "gameInProgress";

type TCardRefsMap = React.MutableRefObject<Map<string, HTMLElement[]>>;

interface ITablePositionsMap {
  [key: string]: string;
}

interface IPlayersMap {
  [key: string]: ITablePositionsMap;
}

export type {
  UserData,
  UserInfo,
  GameRoom,
  AuthResponse,
  IGame,
  IPlayer,
  ITime,
  IActionAnimation,
  IPlayerMoveArgs,
  TCardRefsMap,
  Hand,
  IGameEndData,
  TGameEndReason,
  TRoomJoinDenied,
  ShopPackage,
  IGameStatus,
};
