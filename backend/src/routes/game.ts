import express from "express";
import { fetchChips, fetchRooms, getGameState } from "../controllers/game";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/fetchRooms", auth, fetchRooms);

router.get("/fetchChips", auth, fetchChips);

router.post("/getGameState", auth, getGameState);

export default router;
