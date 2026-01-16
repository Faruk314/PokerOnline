import express from "express";
import { createCheckoutSession, createPaymentIntent } from "../controllers/payment";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/createCheckoutSession", auth, createCheckoutSession);
router.post("/createPaymentIntent", auth, createPaymentIntent);

export default router;
