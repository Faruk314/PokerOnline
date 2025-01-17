import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import query from "../db";
import { VerifiedToken } from "../types/types";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q = "SELECT `userId` FROM users WHERE `email`= ?";

  let result: any = await query(q, [email]);

  if (result.length > 0) {
    res.status(400);
    throw new Error("User with this email already exists");
  }

  if (password.length < 8) {
    res.status(400);
    throw new Error("Password has to be 8 characters min");
  }

  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(password, salt);

  try {
    q = "INSERT INTO users (`userName`,`email`,`password`) VALUES (?, ?, ?)";

    result = await query(q, [userName, email, hash]);

    q =
      "SELECT `userId`,`userName`,`email`,`image` FROM users WHERE `email`= ? AND `password`= ?";

    result = await query(q, [email, hash]);

    const token = jwt.sign(
      { userId: result[0].userId, userName: result[0].userName },
      process.env.JWT_SECRET!
    );

    if (!token) {
      res.status(400);
      throw new Error("Something went wrong with token creation");
    }

    res
      .cookie("token", token, {
        httpOnly: false,
        sameSite: "none",
        secure: true,
      })
      .status(200)
      .json({
        userInfo: {
          userId: result[0].userId,
          userName: result[0].userName,
          email: result[0].email,
          image: result[0].image,
        },
      });
  } catch (error) {
    res.status(500);
    throw new Error("An error occurred during user registration");
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All fields must be filled");
  }

  let q =
    "SELECT `userId`,`userName`,`email`,`password`,`image` FROM users WHERE `email`= ?";

  let data: any = await query(q, [email]);

  if (data.length === 0) {
    res.status(404);
    throw new Error("Incorrect email or password");
  }

  const isPasswordCorrect = bcrypt.compareSync(password, data[0].password);

  if (!isPasswordCorrect) {
    res.status(400);
    throw new Error("Incorrect email or password");
  }

  const token = jwt.sign(
    { userId: data[0].userId, userName: data[0].userName },
    process.env.JWT_SECRET!
  );

  if (!token) {
    res.status(400);
    throw new Error("Something went wrong with token creation");
  }

  res
    .cookie("token", token, {
      httpOnly: false,
      sameSite: "lax",
      secure: false,
    })
    .status(200)
    .json({
      userInfo: {
        userId: data[0].userId,
        userName: data[0].userName,
        email: data[0].email,
        image: data[0].image,
      },
    });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  try {
    res
      .clearCookie("token", {
        httpOnly: false,
        sameSite: "lax",
        secure: false,
      })
      .status(200)
      .json("successfully logged out");
  } catch (error) {
    throw new Error("There was a problem while logging out");
  }
});

export const getLoginStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const token = req.cookies.token;

    if (!token) {
      throw new Error("Jwt token does not exist");
    }

    let verified = jwt.verify(token, process.env.JWT_SECRET!) as VerifiedToken;

    if (!verified) {
      throw new Error("Could not verify jwt token");
    }

    if (verified.userId) {
      let q =
        "SELECT `userId`, `userName`,`email`,`image` FROM users WHERE `userId`= ?";

      let userInfo: any = await query(q, [verified.userId]);

      res.json({ status: true, userInfo: userInfo[0] });
    }
  }
);
