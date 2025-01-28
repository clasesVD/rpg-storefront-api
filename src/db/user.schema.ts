import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";

const usersTable = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  balance: varchar({ length: 255 }).notNull()
});

export default usersTable
