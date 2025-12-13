import { pgTable, text, integer } from "drizzle-orm/pg-core";
import { id, createdAt, updatedAt } from "../schemaHelpers";

export const UserTable = pgTable("users", {
  userId: id,
  userName: text().notNull(),
  image: text(),
  password: text().notNull(),
  salt: text().notNull(),
  email: text().notNull().unique(),
  coins: integer("coins").notNull().default(1000000000),
  createdAt,
  updatedAt,
});
