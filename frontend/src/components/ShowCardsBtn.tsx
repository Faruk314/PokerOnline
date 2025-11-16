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
  const winner = gameState?.potInfo["mainPot"]?.winner;
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
      className="button-border bg-gray-900 px-8 xl:py-2 bg-green-700 hover:bg-green-600 rounded-full text-[1rem] xl:text-2xl"
    >
      SHOW CARDS
    </button>
  );
};

export default ShowCardsBtn;
