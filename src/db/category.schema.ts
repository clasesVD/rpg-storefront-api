import { pgTable, uuid, varchar } from "drizzle-orm/pg-core";

const categoriesTable = pgTable("categories", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
});

export default categoriesTable;
