import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const categorySchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String()
})

const categoryDraftSchema = T.Omit(categorySchema, ['id'])
const categoryParamsSchema = T.Pick(categorySchema, ['id'])

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
  params: T.Object({
    id: categoryParamsSchema
  }),
  response: {
    201: categorySchema
  }
}

export const categoryUpdateSchema = {
  tags: ['Category'],
  params: T.Object({
    id: categoryParamsSchema
  }),
  request: {
    body: categoryDraftSchema
  },
  body: categoryDraftSchema,
  response: {
    201: categorySchema
  }
}

export const categoryDeleteSchema = {
  tags: ['Category'],
  params: T.Object({
    id: categoryParamsSchema
  }),
  request: {
    body: categoryDraftSchema
  },
  body: categoryDraftSchema,
  response: {
    201: categorySchema
  }
}

export type Category = Static<typeof categorySchema>;
export type CategoryDraft = Static<typeof categoryDraftSchema>;
export type CategoryGetAll = FastifyReply<{ Body: Category[] }>;
export type CategoryCreateRequest = FastifyRequest<{ Body: Category }>;
export type CategoryGetByIdRequest = FastifyRequest<{ Params: { id: string } }>;
export type CategoryUpdateRequest = FastifyRequest<{
  Params: { id: string };
  Body: CategoryDraft;
}>;
export type CategoryDeleteSchema = FastifyRequest<{ Params: { id: string } }>;
