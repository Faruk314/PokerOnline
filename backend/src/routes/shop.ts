import express from "express";
import auth from "../middlewares/auth";
import { fetchShopPackages } from "../controllers/shop";

const router = express.Router();

router.get("/fetchShopPackages", auth, fetchShopPackages);

export default router;
