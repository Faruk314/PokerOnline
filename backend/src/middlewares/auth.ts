import { NextFunction, Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { getUserSessionById } from "../redis/methods/session";

const auth = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      res.status(401);
      throw new Error("SessionId does not exist");
    }

    const session = await getUserSessionById(sessionId);

    if (!session) {
      res.status(401);
      throw new Error("Could not find user session");
    }

    req.user = session;

    next();
  }
);

export default auth;
