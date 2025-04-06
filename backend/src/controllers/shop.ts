import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getShopPackages } from "../services/shop";

export const fetchShopPackages = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const packages = await getShopPackages();

      res.status(200).json(packages);
    } catch (error) {
      res.status(400);
      throw new Error("Error fetching shop packages");
    }
  }
);
