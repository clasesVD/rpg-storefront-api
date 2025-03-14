import { pgTable, varchar, uuid, numeric } from 'drizzle-orm/pg-core'

const userTable = pgTable('user', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  balance: numeric({ precision: 10, scale: 2 }).default('0.00')
})

export default userTable
