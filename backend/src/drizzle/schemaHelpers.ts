import { uuid, timestamp } from "drizzle-orm/pg-core";

const id = uuid().primaryKey().defaultRandom();

const createdAt = timestamp({ withTimezone: true }).notNull().defaultNow();
const updatedAt = timestamp({ withTimezone: true })
  .notNull()
  .defaultNow()
  .$onUpdate(() => new Date());

export { id, createdAt, updatedAt };
