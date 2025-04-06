import { client } from "../redis";
import { UserData } from "../../types/types";

const getUser = async (userId: string): Promise<UserData | null> => {
  try {
    const userJSON = await client.hget("users", userId.toString());
    return userJSON ? JSON.parse(userJSON) : null;
  } catch (err) {
    console.error("Error fetching user from Redis:", err);
    return null;
  }
};

const addUser = async (userInfo: UserData): Promise<void> => {
  const { userId } = userInfo;

  try {
    await client.hset("users", userId.toString(), JSON.stringify(userInfo));
  } catch (err) {
    console.error("Error adding/updating user in Redis:", err);
  }
};

const removeUser = (userId: string) => {
  client.hdel("users", userId.toString());
};

export { getUser, addUser, removeUser };
