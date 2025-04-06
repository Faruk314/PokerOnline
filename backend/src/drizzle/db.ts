import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";
import dotenv from "dotenv";

dotenv.config();

export const db = drizzle({
  schema,
  connection: {
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 5433,
  },
});
