import { toast, ToastOptions } from "react-toastify";

const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "dark",
  className: "!bg-gradient-to-br !from-gray-900/90 !to-gray-950/90 !backdrop-blur-xl !border !border-white/10 !rounded-2xl !shadow-2xl",
  bodyClassName: "!text-white !font-medium",
  progressClassName: "!bg-gradient-to-r !from-yellow-500 !to-amber-500",
};

export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, {
    ...defaultOptions,
    ...options,
    className: `${defaultOptions.className} custom-toast custom-toast-success`,
  });
};

export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, {
    ...defaultOptions,
    ...options,
    className: `${defaultOptions.className} custom-toast custom-toast-error`,
  });
};

export const showInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, {
    ...defaultOptions,
    ...options,
    className: `${defaultOptions.className} custom-toast custom-toast-info`,
  });
};

export const showWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, {
    ...defaultOptions,
    ...options,
    className: `${defaultOptions.className} custom-toast custom-toast-warning`,
  });
};

// Poker-specific toast functions
export const showPokerSuccess = (message: string, options?: ToastOptions) => {
  return showSuccess(`🎯 ${message}`, options);
};

export const showPokerError = (message: string, options?: ToastOptions) => {
  return showError(`❌ ${message}`, options);
};

export const showPokerInfo = (message: string, options?: ToastOptions) => {
  return showInfo(`ℹ️ ${message}`, options);
};

export const showPokerWarning = (message: string, options?: ToastOptions) => {
  return showWarning(`⚠️ ${message}`, options);
};

// Game-specific toast functions
export const showGameJoined = (roomName: string, options?: ToastOptions) => {
  return showPokerSuccess(`Joined ${roomName}`, options);
};

export const showPlayerLeft = (playerName: string, options?: ToastOptions) => {
  return showPokerWarning(`${playerName} left the game`, options);
};

export const showRoomCreated = (roomName: string, options?: ToastOptions) => {
  return showPokerSuccess(`Room "${roomName}" created`, options);
};

export const showInsufficientFunds = (options?: ToastOptions) => {
  return showPokerError("Insufficient funds to join room", options);
};

export const showRoomFull = (options?: ToastOptions) => {
  return showPokerError("Room is full", options);
};

export const showGameInProgress = (options?: ToastOptions) => {
  return showPokerError("Game is already in progress", options);
};

export default {
  showSuccess,
  showError,
  showInfo,
  showWarning,
  showPokerSuccess,
  showPokerError,
  showPokerInfo,
  showPokerWarning,
  showGameJoined,
  showPlayerLeft,
  showRoomCreated,
  showInsufficientFunds,
  showRoomFull,
  showGameInProgress,
};