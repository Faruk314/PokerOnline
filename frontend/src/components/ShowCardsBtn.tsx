import { useContext } from "react";
import { useAppSelector } from "../store/hooks";
import { AudioContext } from "../context/AudioContext";
import clickSound from "../assets/audio/click.wav";
import { GameContext } from "../context/GameContext";
import { useParams } from "react-router-dom";

const ShowCardsBtn = () => {
  const gameState = useAppSelector((state) => state.game.gameState);
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const { playAudio } = useContext(AudioContext);
  const { handleShowCards } = useContext(GameContext);
  const { id } = useParams<{ id: string }>();
  const mainPot = gameState?.potInfo?.["mainPot"];
  const winner = mainPot?.winner;
  const isWinnerByEveryoneFolding = winner?.hand === null;
  const isUserWinner = loggedUserInfo?.userId === winner?.userId;
  const winnerCardsShown = gameState?.players.find(
    (p) => p.playerInfo.userId === winner?.userId
  )?.showCards;

  if (!isWinnerByEveryoneFolding || !isUserWinner || winnerCardsShown)
    return null;

  return (
    <button
      onClick={() => {
        playAudio(clickSound);
        handleShowCards(id);
      }}
      className="relative group px-8 py-5 rounded-xl text-white text-base font-bold tracking-wider transition-all duration-300 overflow-hidden bg-gradient-to-r from-green-600 to-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] hover:scale-105 flex-1 h-[80px] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <span className="relative flex flex-col items-center justify-center gap-1">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-white animate-pulse"></div>
          SHOW CARDS
        </div>
      </span>
    </button>
  );
};

export default ShowCardsBtn;
