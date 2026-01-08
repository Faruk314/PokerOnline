import { useAppSelector } from "../store/hooks";
import Player from "./Player";

const VISUAL_POSITIONS = [
  "bottomCenter",
  "bottomLeft",
  "left",
  "topLeft",
  "topCenter",
  "topRight",
] as const;

const TablePositions = () => {
  const players = useAppSelector((state) => state.game.gameState?.players);
  const maxSeats = useAppSelector(
    (state) => state.game.currentGameRoom?.maxPlayers
  );
  const viewerUserId = useAppSelector(
    (state) => state.auth.loggedUserInfo
  )?.userId;
  const TOTAL_SEATS = maxSeats || 5;

  if (!players || !viewerUserId) return null;

  const viewer = players.find(
    (p) => String(p.playerInfo.userId) === String(viewerUserId)
  );
  if (!viewer) return null;

  const viewerSeat = viewer.seatIndex;

  const positionMap: Partial<
    Record<(typeof VISUAL_POSITIONS)[number], (typeof players)[0]>
  > = {};

  players.forEach((player) => {
    const relativeIndex =
      (player.seatIndex - viewerSeat + TOTAL_SEATS) % TOTAL_SEATS;
    const position = VISUAL_POSITIONS[relativeIndex];
    positionMap[position] = player;
  });

  return (
    <>
      {VISUAL_POSITIONS.map((position) => {
        const player = positionMap[position];

        return player ? (
          <Player
            key={player.playerInfo.userId}
            player={player}
            position={position}
          />
        ) : null;
      })}
    </>
  );
};

export default TablePositions;
