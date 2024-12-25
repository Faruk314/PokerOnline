import express from "express";
import middleware from "../utils/middleware";
import { fetchShopPackages } from "../controllers/shop";

const router = express.Router();

router.get("/fetchShopPackages", middleware, fetchShopPackages);

export default router;
