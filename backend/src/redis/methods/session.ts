import crypto from "crypto";
import { SessionSchema } from "../../validation/auth";
import { z } from "zod";
import { client } from "../redis";
import { SESSION_EXPIRATION_SECONDS } from "../../constants/constants";

const createUserSession = async (user: z.infer<typeof SessionSchema>) => {
  const sessionId = crypto.randomBytes(512).toString("hex").normalize();

  await client.set(
    `session:${sessionId}`,
    JSON.stringify(SessionSchema.parse(user)),
    "EX",
    SESSION_EXPIRATION_SECONDS
  );

  return sessionId;
};

const removeUserFromSession = async (sessionId: string) => {
  if (sessionId == null) return null;

  await client.del(`session:${sessionId}`);
};

const getUserSessionById = async (sessionId: string) => {
  const rawUser = await client.get(`session:${sessionId}`);

  if (!rawUser) return null;

  const parsedUser = JSON.parse(rawUser);

  const { success, data: user } = SessionSchema.safeParse(parsedUser);

  return success ? user : null;
};

const updateUserSessionExpiration = async (sessionId: string) => {
  if (sessionId == null) return;

  const user = await getUserSessionById(sessionId);

  if (user == null) return;

  await client.set(
    `session:${sessionId}`,
    JSON.stringify(SessionSchema.parse(user)),
    "EX",
    SESSION_EXPIRATION_SECONDS
  );
};

export {
  createUserSession,
  removeUserFromSession,
  getUserSessionById,
  updateUserSessionExpiration,
};
