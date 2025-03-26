import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'
import {
  userPublicSchema,
  userSchema,
  userDraftSchema,
  type UserCreateRequest,
  type UserCreateResponse
} from './user.schema'

const loginDraftSchema = T.Pick(userSchema, ['email', 'password'])
const loginResponseSchema = T.Object({
  token: T.String(),
  user: userPublicSchema
})

export const registerSchema = {
  tags: ['Auth'],
  request: {
    body: userDraftSchema
  },
  body: userDraftSchema,
  response: {
    200: userPublicSchema
  }
}

export const loginSchema = {
  tags: ['Auth'],
  request: {
    body: loginDraftSchema
  },
  body: loginDraftSchema,
  response: {
    200: loginResponseSchema
  }
}

export type LoginDraft = Static<typeof loginDraftSchema>
export type LoginResponse = Static<typeof loginResponseSchema>
export type AuthLoginRequest = FastifyRequest<{ Body: LoginDraft }>
export type AuthLoginResponse = FastifyReply<{ Body: LoginResponse }>
export type AuthRegisterRequest = UserCreateRequest
export type AuthRegisterResponse = UserCreateResponse
