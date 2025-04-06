import express from "express";
import { createCheckoutSession } from "../controllers/payment";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/createCheckoutSession", auth, createCheckoutSession);

export default router;
