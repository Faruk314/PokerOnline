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
  players: { userId: string; userName: string }[];
  gameState?: IGame;
}

interface IActionAnimation {
  state: ActionState;
}

type ActionState = "fold" | "check" | "raise" | "call" | "all in" | null;

interface IGame {
  roomId: string;
  totalPot: number;
  minRaiseDiff: number;
  playerTurn: IPlayer;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastMaxBet: number;
  currentRound: string;
  potInfo: PotInfo;
  isGameOver: boolean;
}

interface PotState {
  isDraw: boolean;
  potSpliters?: { userId: string; hand: Hand }[];
  winner?: { userId: string; hand: Hand | null };
  amount: number;
}

type PotInfo = Record<string, PotState>;

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
  seatIndex: number;
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
  showCards: boolean;
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
  action: ActionState;
  playerId: string;
  previousPlayerPot: number;
  previousTotalPot: number;
  previousRound: string;
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

interface GameStateRollbackParams {
  gameState: IGame;
  playerId: string;
  previousPlayerPot: number;
  previousTotalPot: number;
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

type ChipMoveDirection = "playerToTable" | "tableToPlayer";

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
  ITablePositionsMap,
  ChipMoveDirection,
  GameStateRollbackParams,
};
