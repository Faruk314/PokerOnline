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

    try {
      const roomJSON = await client.get(`${ROOMS_KEY}:${roomId}`);

      if (roomJSON) {
        const room: RoomData = JSON.parse(roomJSON);
        res.status(200).json(room.gameState);
      }
    } catch (error) {
      res.status(404);
      throw new Error("Game state not found");
    }
  }
);
