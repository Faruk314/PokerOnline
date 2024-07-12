import express from "express";
import { fetchRooms, getGameState } from "../controllers/game";

const router = express.Router();

router.get("/fetchRooms", fetchRooms);

router.post("/getGameState", getGameState);

export default router;
