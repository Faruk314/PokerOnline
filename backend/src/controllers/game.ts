import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getRooms } from "../socket/socketMethods";
import { client } from "../index";
import { RoomData } from "../types/types";

const ROOMS_KEY = "rooms";

export const fetchRooms = asyncHandler(async (req: Request, res: Response) => {
  try {
    const rooms = await getRooms();
    res.status(200).json(rooms);
  } catch (error) {
    throw new Error("Failed to fetch rooms");
  }
});

export const getGameState = asyncHandler(
  async (req: Request, res: Response) => {
    const roomId = req.body.roomId;
    const userId = req.user?.userId;

    try {
      const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

      if (roomJSON) {
        const room: RoomData = JSON.parse(roomJSON);

        const updatedGameState = { ...room.gameState };

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
              cards: player.cards,
            };
          }

          if (player.playerInfo.userId === userId) {
            return {
              ...player,
              cards: player.cards,
            };
          }

          return {
            ...player,
            cards: ["", ""],
          };
        });

        updatedGameState.players = updatedPlayers;

        res.status(200).json(updatedGameState);
      }
    } catch (error) {
      res.status(404);
      throw new Error("Game state not found");
    }
  }
);
