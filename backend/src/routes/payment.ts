import express from "express";
import { createCheckoutSession } from "../controllers/payment";
import middleware from "../utils/middleware";

const router = express.Router();

router.post("/createCheckoutSession", middleware, createCheckoutSession);

export default router;
