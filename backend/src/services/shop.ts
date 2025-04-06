import { db } from "../drizzle/db";
import { CoinPackagesTable } from "../drizzle/schema";

const getShopPackages = async () => {
  const packages = await db
    .select({
      packageId: CoinPackagesTable.packageId,
      amount: CoinPackagesTable.amount,
      price: CoinPackagesTable.price,
    })
    .from(CoinPackagesTable);

  if (packages == null) throw new Error("Could not get shop packages");

  return packages;
};

export { getShopPackages };
