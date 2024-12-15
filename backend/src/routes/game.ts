import express from "express";
import { fetchRooms, getGameState } from "../controllers/game";
import middleware from "../utils/middleware";

const router = express.Router();

router.get("/fetchRooms", middleware, fetchRooms);

router.post("/getGameState", middleware, getGameState);

export default router;
