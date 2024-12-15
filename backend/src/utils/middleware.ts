import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { VerifiedToken } from "../types/types";

const middleware = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
      res.status(400);
      throw new Error("Not verified");
    }

    let verified = jwt.verify(token, process.env.JWT_SECRET!) as VerifiedToken;

    if (verified) {
      const userData = verified;

      req.user = userData;

      next();
    }
  }
);

export default middleware;
