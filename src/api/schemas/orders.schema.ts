import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyRequest } from 'fastify'

const orderItemSchema = T.Object({
  name: T.String(),
  description: T.String(),
  image: T.String(),
  rarityId: T.String({ format: 'uuid' }),
  price: T.Number(),
  quantity: T.Integer({ minimum: 1 })
})

const orderSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  userId: T.String({ format: 'uuid' }),
  products: T.Array(orderItemSchema, { default: [] })
})

export const orderPublicSchema = orderSchema
export const orderDraftSchema = T.Object({
  cartId: T.String({ format: 'uuid' })
})
export const orderParamsSchema = T.Pick(orderSchema, ['id'])

export const orderGetAllSchema = {
  tags: ['Order'],
  response: {
    200: T.Array(orderPublicSchema)
  }
}

export const orderGetByIdSchema = {
  tags: ['Order'],
  response: {
    200: orderPublicSchema
  }
}

export const orderCreateSchema = {
  tags: ['Order'],
  request: {
    body: orderDraftSchema
  },
  body: orderDraftSchema,
  response: {
    200: orderPublicSchema
  }
}

export const orderDeleteSchema = {
  tags: ['Order'],
  request: {
    params: orderParamsSchema
  },
  response: {
    200: orderPublicSchema
  }
}

export type OrderDraft = Static<typeof orderDraftSchema>
export type OrderParams = Static<typeof orderParamsSchema>
export type OrderCreateRequest = FastifyRequest<{ Body: OrderDraft }>
export type OrderGetByIdRequest = FastifyRequest<{ Params: OrderParams }>
export type OrderDeleteRequest = FastifyRequest<{ Params: OrderParams }>
