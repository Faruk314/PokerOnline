import { useAppSelector } from "../store/hooks";
import Player from "./Player";

const TablePositions = () => {
  const loggedUserInfo = useAppSelector((state) => state.auth.loggedUserInfo);
  const gameState = useAppSelector((state) => state.game.gameState);

  if (!gameState) return null;

  const tablePositions = gameState?.tablePositions;

  if (!tablePositions) return null;

  if (!loggedUserInfo?.userId) return null;

  const userTablePositions = tablePositions[loggedUserInfo.userId];

  if (!userTablePositions) return null;

  return Object.entries(userTablePositions).map(([key, value]) => {
    const playerData = gameState?.players.find(
      (p) => p.playerInfo.userId === key
    );

    if (typeof value !== "string" || !playerData) return null;

    return <Player key={key} player={playerData} position={value} />;
  });
};

export default TablePositions;
