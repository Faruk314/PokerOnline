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

interface IGame {
  totalPot: number;
  playerTurn: IPlayer;
  deck: string[];
  communityCards: string[];
  players: IPlayer[];
  lastBet: number;
  currentRound: string;
}

interface IRaise {
  isRaise: boolean;
  amount: number;
}

interface Hand {
  name: string;
  cards: string[];
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
}

interface UserInfo {
  userId: number;
  userName: string;
  email: string;
  image: string;
}

export type { UserData, UserInfo, GameRoom, AuthResponse, IGame, IPlayer };
