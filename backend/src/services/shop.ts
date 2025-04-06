import { db } from "../drizzle/db";
import { CoinPackagesTable } from "../drizzle/schema";

const getShopPackages = async () => {
  const packages = await db.query.CoinPackagesTable.findMany({
    columns: {
      packageId: true,
      amount: true,
      price: true,
    },
  });

  if (packages.length === 0) throw new Error("Could not get shop packages");

  return packages;
};

export { getShopPackages };
