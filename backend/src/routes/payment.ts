import express from "express";
import { createCheckoutSession } from "../controllers/payment";

const router = express.Router();

router.post("/createCheckoutSession", createCheckoutSession);

export default router;
