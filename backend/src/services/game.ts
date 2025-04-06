import { db } from "../drizzle/db";
import { UserTable } from "../drizzle/schema";
import { eq, sql, and } from "drizzle-orm";

const getPlayerCoins = async (playerId: string) => {
  const result = await db
    .select({ coins: UserTable.coins })
    .from(UserTable)
    .where(eq(UserTable.userId, playerId));

  if (result == null) return 0;

  return result[0].coins;
};

const decrementPlayerCoins = async (playerId: string, amount: number) => {
  const result = await db
    .update(UserTable)
    .set({
      coins: sql`${UserTable.coins} - ${amount}`,
    })
    .where(
      and(eq(UserTable.userId, playerId), sql`${UserTable.coins} >= ${amount}`)
    );

  if (result.rowCount === 0) {
    return false;
  }

  return true;
};

const incrementPlayerCoins = async (playerId: string, amount: number) => {
  const result = await db
    .update(UserTable)
    .set({
      coins: sql`${UserTable.coins} + ${amount}`,
    })
    .where(eq(UserTable.userId, playerId));

  if (result.rowCount === 0) {
    return false;
  }

  return true;
};

export { getPlayerCoins, decrementPlayerCoins, incrementPlayerCoins };
