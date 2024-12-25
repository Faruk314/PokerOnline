import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import query from "../db";

export const fetchShopPackages = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      let q = "SELECT `packageId`, `amount`, `price` FROM coin_packages";

      let data = await query(q, []);

      res.status(200).json(data);
    } catch (error) {
      res.status(400);
      throw new Error("Error fetching shop packages");
    }
  }
);
