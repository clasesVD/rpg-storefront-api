import { Type as T } from '@sinclair/typebox'

const raritySchema = T.Object({
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
