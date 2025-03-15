import { Type as T, type Static } from '@sinclair/typebox'

export const productSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  itemId: T.String({ format: 'uuid' }),
  rarityId: T.String({ format: 'uuid' }),
  price: T.Number()
})

export type Product = Static<typeof productSchema>
