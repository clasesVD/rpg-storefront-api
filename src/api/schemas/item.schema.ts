import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const itemSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String(),
  description: T.String(),
  image: T.String(),
  categories: T.Array(T.Object({
    id: T.String({ format: 'uuid' }),
    name: T.String()
  }), { default: [] })
})

const itemDraftSchema = T.Omit(itemSchema, ['id'])
const itemPublicSchema = itemSchema
const itemParamsSchema = T.Pick(itemSchema, ['id'])
const itemUpdateSchema = T.Partial(itemDraftSchema)

export const itemGetAllSchema = {
  tags: ['Item'],
  response: {
    200: T.Array(itemPublicSchema)
  }
}

export const itemCreateSchema = {
  tags: ['Item'],
  request: {
    body: itemDraftSchema
  },
  body: itemDraftSchema,
  response: {
    200: itemPublicSchema
  }
}

export const itemGetByIdSchema = {
  tags: ['Item'],
  response: {
    200: itemPublicSchema
  }
}

export const itemPatchByIdSchema = {
  tags: ['Item'],
  request: {
    body: itemUpdateSchema
  },
  body: itemUpdateSchema,
  response: {
    200: itemPublicSchema
  }
}

export const itemDeleteByIdSchema = {
  tags: ['Item'],
  response: {
    200: itemPublicSchema
  }
}

export type Item = Static<typeof itemSchema>
export type ItemDraft = Static<typeof itemDraftSchema>
export type ItemPublic = Static<typeof itemPublicSchema>
export type ItemParams = Static<typeof itemParamsSchema>
export type ItemUpdate = Static<typeof itemUpdateSchema>
export type ItemGetAll = FastifyReply<{ Body: Item[] }>
export type ItemCreateRequest = FastifyRequest<{ Body: ItemDraft }>
export type ItemParamsRequest = FastifyRequest<{ Params: ItemParams }>
export type ItemPatchByIdRequest = FastifyRequest<{ Body: ItemUpdate, Params: ItemParams }>
