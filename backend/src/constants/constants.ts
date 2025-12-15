import dotenv from "dotenv";
dotenv.config();

const ROOMS_KEY = "rooms";

const COOKIE_SESSION_KEY = "sessionId";

const STRIPE_KEY = process.env.STRIPE_KEY ? process.env.STRIPE_KEY : "";

const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET
  ? process.env.STRIPE_WEBHOOK_SECRET
  : "";

const PLAYER_TIMER_QUEUE_NAME = "playerTimerQueue";

const RESET_GAME_QUEUE_NAME = "resetGameQueue";

const SESSION_EXPIRATION_SECONDS = 60 * 60 * 24 * 7;

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

const suits = ["H", "D", "C", "S"];

const ranks = [
  "A",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
];

export {
  ROOMS_KEY,
  COOKIE_SESSION_KEY,
  STRIPE_KEY,
  STRIPE_WEBHOOK_SECRET,
  PLAYER_TIMER_QUEUE_NAME,
  RESET_GAME_QUEUE_NAME,
  SESSION_EXPIRATION_SECONDS,
  handRanks,
  suits,
  ranks,
};
