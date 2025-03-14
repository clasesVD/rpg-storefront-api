import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core'

const categoryTable = pgTable('category', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).unique().notNull()
})

export default categoryTable
