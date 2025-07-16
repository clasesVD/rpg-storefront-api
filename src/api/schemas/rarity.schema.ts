import { Type as T, type Static } from '@sinclair/typebox'

export const raritySchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String(),
  color: T.String()
})

export const rarityGetAllSchema = {
  tags: ['Rarity'],
  response: {
    200: T.Array(raritySchema)
  }
}

export type Rarity = Static<typeof raritySchema>
