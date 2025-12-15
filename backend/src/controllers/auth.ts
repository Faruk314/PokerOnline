import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import { z } from "zod";
import { LoginSchema, RegisterSchema } from "../validation/auth";
import { getUser, insertUser } from "../services/auth";
import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import {
  createUserSession,
  getUserSessionById,
  removeUserFromSession,
} from "../redis/methods/session";
import { comparePasswords } from "../utils/auth";
import { COOKIE_SESSION_KEY } from "../constants/constants";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const unsafeData: z.infer<typeof RegisterSchema> = req.body;

  const { success, data } = RegisterSchema.safeParse(unsafeData);

  if (!success) {
    res.status(400);
    throw new Error("Unable to create account invalid data");
  }

  const { userName, email, password } = data;

  const existingUser = await db.query.UserTable.findFirst({
    where: eq(UserTable.email, data.email),
  });

  if (existingUser != null) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  try {
    const userInfo = await insertUser({ userName, email, password });

    const sessionId = await createUserSession({ userId: userInfo.userId });

    res
      .cookie(COOKIE_SESSION_KEY, sessionId, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        domain: ".farukspahic.com",
      })
      .status(200)
      .json({
        userInfo,
      });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred during user registration");
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const unsafeData: z.infer<typeof LoginSchema> = req.body;

  const { success, data } = LoginSchema.safeParse(unsafeData);

  if (!success) {
    res.status(400);
    throw new Error("Unable to create account invalid data");
  }

  const { password, email } = data;

  const user = await db.query.UserTable.findFirst({
    columns: {
      password: true,
      salt: true,
      userId: true,
      email: true,
      userName: true,
      image: true,
      coins: true,
    },
    where: eq(UserTable.email, email),
  });

  if (user == null) {
    res.status(404);
    throw new Error("Could not log you in");
  }

  const isCorrectPassword = await comparePasswords({
    hashedPassword: user.password,
    password: password,
    salt: user.salt,
  });

  if (!isCorrectPassword) {
    res.status(401);
    throw new Error("Incorrect email or password");
  }

  const sessionId = await createUserSession(user);

  res
    .cookie(COOKIE_SESSION_KEY, sessionId, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      domain: ".farukspahic.com",
    })
    .status(200)
    .json({
      userInfo: {
        userId: user.userId,
        userName: user.userName,
        email: user.email,
        image: user.image,
        coins: user.coins,
      },
    });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const sessionId = req.cookies.sessionId;

  try {
    await removeUserFromSession(sessionId);
    res
      .clearCookie(COOKIE_SESSION_KEY, {
        httpOnly: true,
        sameSite: "none",
        secure: true,
        domain: ".farukspahic.com",
      })
      .status(200)
      .json("successfully logged out");
  } catch (error) {
    throw new Error("There was a problem while logging out");
  }
});

export const getLoginStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const sessionId = req.cookies.sessionId;

    if (!sessionId) {
      res.status(401);
      throw new Error("SessionId does not exist");
    }

    let session = await getUserSessionById(sessionId);

    if (!session) {
      res.status(401);
      throw new Error("Could not find user session");
    }

    try {
      const userInfo = await getUser(session.userId);

      res.json({ status: true, userInfo });
    } catch {
      res.status(404);
      throw new Error("Could not find user");
    }
  }
);
