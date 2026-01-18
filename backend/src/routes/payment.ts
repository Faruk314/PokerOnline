import express from "express";
import { createPaymentIntent } from "../controllers/payment";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/createPaymentIntent", auth, createPaymentIntent);

export default router;
