import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema/user";
import { generateSalt, hashPassword } from "../utils/auth";
import { eq } from "drizzle-orm";

const getUser = async (userId: string) => {
  const user = db.query.UserTable.findFirst({
    columns: {
      userId: true,
      userName: true,
      email: true,
      image: true,
      coins: true,
    },
    where: eq(UserTable.userId, userId),
  });

  if (user == null) throw new Error("Failed to find user");

  return user;
};

const insertUser = async (data: {
  userName: string;
  email: string;
  password: string;
}) => {
  const { userName, email } = data;

  const salt = await generateSalt();
  const hashedPassword = await hashPassword(data.password, salt);

  const [user] = await db
    .insert(UserTable)
    .values({
      userName,
      email,
      password: hashedPassword,
      salt,
    })
    .returning({
      userId: UserTable.userId,
      userName: UserTable.userName,
      email: UserTable.email,
      image: UserTable.image,
      coins: UserTable.coins,
    });

  if (user == null) throw new Error("Failed to create user");

  return user;
};

export { insertUser, getUser };
