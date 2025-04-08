import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getRooms } from "../redis/methods/room";
import { client } from "../redis/redis";
import { IPlayer, RoomData } from "../types/types";
import { getPlayerCoins as getPlayerCoinsDb } from "../services/game";

const ROOMS_KEY = "rooms";

const fetchRooms = asyncHandler(async (req: Request, res: Response) => {
  try {
    const rooms = await getRooms();
    res.status(200).json(rooms);
  } catch (error) {
    res.status(400);
    throw new Error("Failed to fetch rooms");
  }
});

const getGameState = asyncHandler(async (req: Request, res: Response) => {
  const roomId = req.body.roomId;
  const userId = req.user?.userId;

  try {
    const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

    if (roomJSON) {
      const room: RoomData = JSON.parse(roomJSON);

      const updatedGameState = { ...room.gameState };
      const currentPlayerId = updatedGameState.playerTurn?.playerInfo.userId;

      if (!updatedGameState) {
        res.status(404);
        throw new Error("Game state not found in getGameState controller");
      }

      if (!updatedGameState.players) {
        res.status(404);
        throw new Error(
          "Players array not found in gameState in getGameState controller"
        );
      }

      const updatedPlayers = updatedGameState.players.map((player: any) => {
        if (updatedGameState.winner || updatedGameState.draw!.isDraw) {
          return {
            ...player,
            cards: [...player.cards],
          };
        }

        if (player.playerInfo.userId === userId) {
          return {
            ...player,
            cards: [...player.cards],
          };
        }

        return {
          ...player,
          cards: ["", ""],
        };
      });

      updatedGameState.players = updatedPlayers;

      if (currentPlayerId !== userId) {
        const playerTurnClone = { ...updatedGameState.playerTurn } as IPlayer;
        playerTurnClone.cards = ["", ""];
        updatedGameState.playerTurn = playerTurnClone;
      }

      res.status(200).json(updatedGameState);
    }
  } catch (error) {
    res.status(404);
    throw new Error("Game state not found");
  }
});

const fetchChips = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.userId;

  if (!userId) {
    res.status(400);
    throw new Error("User id does not exist in fetch chips");
  }

  try {
    const coins = await getPlayerCoinsDb(userId);
    res.status(200).json({ coins });
  } catch (error: any) {
    res.status(400);
    throw new Error(error.message);
  }
});

export { fetchRooms, getGameState, fetchChips };
