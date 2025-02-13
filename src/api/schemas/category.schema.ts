import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const categorySchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String()
})

const categoryDraftSchema = T.Omit(categorySchema, ['id'])
const categoryParamsSchema = T.Pick(categorySchema, ['id'])
const categoryPatchSchema = T.Partial(categoryDraftSchema)

export const categoryGetAllSchema = {
  tags: ['Category'],
  response: {
    200: T.Array(categorySchema)
  }
}

export const categoryCreateSchema = {
  tags: ['Category'],
  request: {
    body: categoryDraftSchema
  },
  body: categoryDraftSchema,
  response: {
    201: categorySchema
  }
}

export const categoryGetByIdSchema = {
  tags: ['Category'],
  response: {
    200: categorySchema
  }
}

export const categoryUpdateSchema = {
  tags: ['Category'],
  request: {
    body: categoryPatchSchema
  },
  body: categoryPatchSchema,
  response: {
    200: categorySchema
  }
}

export const categoryDeleteSchema = {
  tags: ['Category'],
  response: {
    200: categorySchema
  }
}

export type Category = Static<typeof categorySchema>;
export type CategoryDraft = Static<typeof categoryDraftSchema>;
export type CategoryParams = Static<typeof categoryParamsSchema>;
export type CategoryUpdate = Static<typeof categoryPatchSchema>;
export type CategoryGetAll = FastifyReply<{ Body: Category[] }>;
export type CategoryCreateRequest = FastifyRequest<{ Body: Category }>;
export type CategoryGetByIdRequest = FastifyRequest<{ Params: CategoryParams }>;
export type CategoryUpdateRequest = FastifyRequest<{
  Params: CategoryParams;
  Body: CategoryUpdate;
}>;
export type CategoryDeleteSchema = FastifyRequest<{ Params: CategoryParams }>;
