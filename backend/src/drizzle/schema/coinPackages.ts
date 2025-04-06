import { pgTable, integer } from "drizzle-orm/pg-core";
import { id } from "../schemaHelpers";

export const CoinPackagesTable = pgTable("coinPackages", {
  packageId: id,
  amount: integer("amount").notNull(),
  price: integer("price").notNull(),
});
