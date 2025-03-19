import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const authSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String(),
  email: T.String({ format: 'email' }),
  password: T.String({ minLength: 6 })
})

const authDraftSchema = T.Omit(authSchema, ['id'])
const authParamsSchema = T.Omit(authSchema, ['id', 'name'])
const authPublicSchema = T.Omit(authSchema, ['password', 'id'])

export const authCreateSchema = {
  request: {
    body: authDraftSchema
  },
  body: authDraftSchema,
  response: {
    200: authPublicSchema
  }
}

export const authLoginSchema = {
  request: {
    body: authParamsSchema
  },
  body: authParamsSchema,
  response: {
    200: authPublicSchema
  }
}

export type Auth = Static<typeof authSchema>
export type AuthDraft = Static<typeof authDraftSchema>
export type AuthPublic = Static<typeof authPublicSchema>
export type AuthParams = Static<typeof authParamsSchema>
export type AuthGetAll = FastifyReply<{ Body: Auth[] }>
export type AuthCreateRequest = FastifyRequest<{ Body: AuthDraft }>
export type AuthCreateResponse = FastifyReply<{ Body: AuthPublic }>
export type AuthLoginRequest = FastifyRequest<{ Body: AuthParams }>
export type AuthLoginResponse = FastifyReply<{ Body: AuthPublic }>
