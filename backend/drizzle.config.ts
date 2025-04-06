import { defineConfig } from "drizzle-kit";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  out: "./src/drizzle/migrations",
  schema: "./src/drizzle/schema.ts",
  strict: true,
  verbose: true,
  dialect: "postgresql",
  dbCredentials: {
    password: process.env.DB_PASSWORD || "",
    port: Number(process.env.DB_PORT) || 5433,
    user: process.env.DB_USER || "",
    database: process.env.DB_NAME || "",
    host: process.env.DB_HOST || "",
    ssl: false,
  },
});
