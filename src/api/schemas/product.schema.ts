import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const productSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  itemId: T.String({ format: 'uuid' }),
  rarityId: T.String({ format: 'uuid' }),
  price: T.String({ pattern: '[0-9]+([.][0-9]{2})?' })
})

export const productDraftSchema = T.Omit(productSchema, ['id'])
export const productPublicSchema = productSchema
export const productParamsSchema = T.Pick(productSchema, ['id'])
export const productUpdateSchema = T.Omit(productDraftSchema, ['itemId', 'rarityId'])

export const productGetAllSchema = {
  tags: ['Product'],
  response: {
    200: T.Array(productPublicSchema)
  }
}

export const productCreateSchema = {
  tags: ['Product'],
  request: {
    body: productDraftSchema
  },
  body: productDraftSchema,
  response: {
    200: productPublicSchema
  }
}

export const productGetByIdSchema = {
  tags: ['Product'],
  response: {
    200: productPublicSchema
  }
}

export const productPatchByIdSchema = {
  tags: ['Product'],
  request: {
    body: productUpdateSchema
  },
  body: productUpdateSchema,
  response: {
    200: productPublicSchema
  }
}

export const productDeleteByIdSchema = {
  tags: ['Product'],
  response: {
    200: productPublicSchema
  }
}

export type Product = Static<typeof productSchema>
export type ProductDraft = Static<typeof productDraftSchema>
export type ProductPublic = Static<typeof productPublicSchema>
export type ProductParams = Static<typeof productParamsSchema>
export type ProductUpdate = Static<typeof productUpdateSchema>
export type ProductGetAll = FastifyReply<{ Body: Product[] }>
export type ProductCreateRequest = FastifyRequest<{ Body: ProductDraft }>
export type ProductParamsRequest = FastifyRequest<{ Params: ProductParams }>
export type ProductPatchByIdRequest = FastifyRequest<{ Body: ProductUpdate, Params: ProductParams }>
