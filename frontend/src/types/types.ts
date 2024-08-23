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
  players: [];
}

interface IDraw {
  isDraw: boolean;
  potSpliters: { userId: number; hand: Hand }[];
}

interface IActionAnimation {
  state: "fold" | "check" | "raise" | "call" | null;
  playerId: number | null;
}

interface IGame {
  totalPot: number;
  playerTurn: IPlayer;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastBet: number;
  currentRound: string;
  winner: { userId: number; hand: Hand };
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
  isFold: boolean;
  isCall: boolean;
  isCheck: boolean;
  playerPot: number;
  playerRaise: IRaise;
  hand: Hand | null;
  time: ITime | null;
}

interface UserInfo {
  userId: number;
  userName: string;
  email: string;
  image: string;
}

interface IPlayerMoveArgs {
  gameState: IGame;
  roomId: string;
  action: string;
  playerId: number;
}

type TCardRefsMap = React.MutableRefObject<Map<number, HTMLElement[]>>;

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
};
