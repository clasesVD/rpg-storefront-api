import { relations } from 'drizzle-orm'
import {
  pgTable,
  uuid,
  primaryKey,
  varchar,
  numeric,
  unique,
  integer,
  pgEnum
} from 'drizzle-orm/pg-core'

////////////
// Enums  //
////////////

export const userRoleEnum = pgEnum('user_role', ['A', 'C'])

////////////
// Tables //
////////////

export const userTable = pgTable('user', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull(),
  balance: numeric({ precision: 10, scale: 2 }).default('0.00'),
  role: userRoleEnum('role').notNull()
})

export const categoryTable = pgTable('category', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).unique().notNull()
})

export const rarityTable = pgTable('rarity', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  color: varchar({ length: 255 }).notNull()
})

export const itemTable = pgTable('item', {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: varchar({ length: 255 }).notNull(),
  image: varchar({ length: 255 }).notNull()
})

export const productTable = pgTable('product', {
  id: uuid().defaultRandom().primaryKey(),
  itemId: uuid('item_id').notNull().references(() => itemTable.id, { onDelete: 'cascade' }),
  rarityId: uuid('rarity_id').notNull().references(() => rarityTable.id),
  price: numeric({ precision: 10, scale: 2 }).notNull()
}, (t) => [unique().on(t.itemId, t.rarityId)])

export const itemToCategoryTable = pgTable('item_to_category', {
  itemId: uuid('item_id').notNull().references(() => itemTable.id, { onDelete: 'cascade' }),
  categoryId: uuid('category_id').notNull().references(() => categoryTable.id, { onDelete: 'cascade' })
}, (t) => [primaryKey({ columns: [t.itemId, t.categoryId] })])

export const cartTable = pgTable('cart', {
  id: uuid().defaultRandom().primaryKey(),
  userId: uuid('user_id').notNull().references(() => userTable.id, { onDelete: 'cascade' })
})

export const cartToProductTable = pgTable('cart_to_product', {
  cartId: uuid('cart_id').notNull().references(() => cartTable.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').notNull().references(() => productTable.id, { onDelete: 'cascade' }),
  quantity: integer('quantity').notNull().default(1)
}, (t) => [primaryKey({ columns: [t.cartId, t.productId] })])

///////////////
// Relations //
///////////////

export const categoryRelations = relations(categoryTable, ({ many }) => ({
  itemToCategory: many(itemToCategoryTable)
}))

export const rarityRelations = relations(rarityTable, ({ many }) => ({
  rarityToProduct: many(productTable)
}))

export const itemRelations = relations(itemTable, ({ many }) => ({
  itemToCategory: many(itemToCategoryTable),
  itemToProduct: many(productTable)
}))

export const productRelations = relations(productTable, ({ one, many }) => ({
  item: one(itemTable, {
    fields: [productTable.itemId],
    references: [itemTable.id]
  }),
  rarity: one(rarityTable, {
    fields: [productTable.rarityId],
    references: [rarityTable.id]
  }),
  cart: many(cartToProductTable)
}))

export const itemToCategoryRelations = relations(itemToCategoryTable, ({ one }) => ({
  item: one(categoryTable, {
    fields: [itemToCategoryTable.categoryId],
    references: [categoryTable.id]
  }),
  category: one(itemTable, {
    fields: [itemToCategoryTable.itemId],
    references: [itemTable.id]
  })
}))

export const cartRelations = relations(cartTable, ({ one, many }) => ({
  user: one(userTable, {
    fields: [cartTable.userId],
    references: [userTable.id]
  }),
  product: many(cartToProductTable)
}))

export const cartToProductRelations = relations(cartToProductTable, ({ one }) => ({
  cart: one(cartTable, {
    fields: [cartToProductTable.cartId],
    references: [cartTable.id]
  }),
  product: one(productTable, {
    fields: [cartToProductTable.productId],
    references: [productTable.id]
  })
}))
