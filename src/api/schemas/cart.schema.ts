import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'
import { productPublicSchema } from './product.schema'

const cartSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  userId: T.String({ format: 'uuid' }),
  products: T.Array(
    T.Object({
      product: productPublicSchema,
      quantity: T.Integer({ minimum: 1 })
    }), { default: [] }
  )
})

export const cartPublicSchema = cartSchema
export const cartDraftSchema = T.Pick(cartSchema, ['userId'])
export const cartParamsSchema = T.Pick(cartSchema, ['id'])

export const cartProductDtoSchema = T.Object({
  productId: T.String({ format: 'uuid' }),
  quantity: T.Integer({ minimum: 1 })
})

export const cartProductUpdateDtoSchema = T.Pick(cartProductDtoSchema, ['quantity'])
export const cartProductParamsSchema = T.Object({
  cartId: T.String({ format: 'uuid' }),
  productId: T.String({ format: 'uuid' })
})

export const cartGetAllSchema = {
  tags: ['Cart'],
  response: {
    200: T.Array(cartPublicSchema)
  }
}

export const cartGetByIdSchema = {
  tags: ['Cart'],
  response: {
    200: cartPublicSchema
  }
}

export const cartCreateSchema = {
  tags: ['Cart'],
  request: {
    params: cartDraftSchema
  },
  body: cartDraftSchema,
  response: {
    200: cartPublicSchema
  }
}

export const cartAddProductSchema = {
  tags: ['Cart'],
  request: {
    params: cartParamsSchema,
    body: cartProductDtoSchema
  },
  body: cartProductDtoSchema,
  response: {
    200: cartPublicSchema
  }
}

export const cartUpdateProductSchema = {
  tags: ['Cart'],
  request: {
    params: cartProductParamsSchema,
    body: cartProductUpdateDtoSchema
  },
  body: cartProductUpdateDtoSchema,
  response: {
    200: cartPublicSchema
  }
}

export const cartRemoveProductSchema = {
  tags: ['Cart'],
  request: {
    params: cartProductParamsSchema
  },
  response: {
    200: cartPublicSchema
  }
}

export const cartDeleteSchema = {
  tags: ['Cart'],
  request: {
    params: cartParamsSchema
  },
  response: {
    200: cartPublicSchema
  }
}

export type Cart = Static<typeof cartPublicSchema>
export type CartDraft = Static<typeof cartDraftSchema>
export type CartParams = Static<typeof cartParamsSchema>
export type CartProductDto = Static<typeof cartProductDtoSchema>
export type CartProductUpdateDto = Static<typeof cartProductUpdateDtoSchema>
export type CartProductParams = Static<typeof cartProductParamsSchema>
export type CartGetAllResponse = FastifyReply<{ Body: Cart[] }>
export type CartGetByIdRequest = FastifyRequest<{ Params: CartParams }>
export type CartGetByIdResponse = FastifyReply<{ Body: Cart }>
export type CartCreateRequest = FastifyRequest<{ Body: CartDraft }>
export type CartCreateResponse = FastifyReply<{ Body: Cart }>
export type CartAddProductRequest = FastifyRequest<{ Params: CartParams, Body: CartProductDto }>
export type CartAddProductResponse = FastifyReply<{ Body: Cart }>
export type CartUpdateProductRequest = FastifyRequest<{ Params: CartProductParams, Body: CartProductUpdateDto }>
export type CartUpdateProductResponse = FastifyReply<{ Body: Cart }>
export type CartRemoveProductRequest = FastifyRequest<{ Params: CartProductParams }>
export type CartRemoveProductResponse = FastifyReply<{ Body: Cart }>
export type CartDeleteRequest = FastifyRequest<{ Params: CartParams }>
export type CartDeleteResponse = FastifyReply<{ Body: Cart }>
