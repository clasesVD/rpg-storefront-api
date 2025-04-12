import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyRequest } from 'fastify'
import {
  userPublicSchema,
  userSchema,
  userDraftSchema,
  type UserCreateRequest
} from './user.schema'
import type { ROLE } from '../../enums/roles'

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
export type AuthLoginRequest = FastifyRequest<{ Body: LoginDraft }>
export type AuthRegisterRequest = UserCreateRequest
export type JWTPayload = {
  iss: string;
  sub: string;
  iat: number;
  exp: number;
  role: ROLE
}
