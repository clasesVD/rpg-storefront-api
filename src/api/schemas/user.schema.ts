import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'

export const userSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String(),
  email: T.String({ format:'email' }),
  password: T.String(),
  balance: T.String()
})

const userDraftSchema = T.Omit(userSchema, ['id', 'balance'])
const userPublicSchema = T.Omit(userSchema, ['password'])
const userParamsSchema = T.Pick(userSchema, ['id'])
const userOptionalSchema = T.Partial(userDraftSchema)

export const userGetAllSchema = {
  response: {
    200: T.Array(userSchema)
  }
}

export const userCreateSchema = {
  request: {
    body: userDraftSchema
  },
  body: userDraftSchema,
  response: {
    200: userPublicSchema
  }
}

export const userGetByIdSchema = {
  response: {
    200: userPublicSchema
  }
}

export const userPatchByIdSchema = {
  request: {
    body: userOptionalSchema
  },
  body: userOptionalSchema,
  response: {
    200: userPublicSchema
  }
}

export const userDeleteByIdSchema = {
  request: {
    body: userParamsSchema
  },
  response: {
    200: userPublicSchema
  }
}

export type User = Static<typeof userSchema>
export type UserDraft = Static<typeof userDraftSchema>
export type UserPublic = Static<typeof userPublicSchema>
export type UserParams = Static<typeof userParamsSchema>
export type UserOptional = Static<typeof userOptionalSchema>
export type UserGetAll = FastifyReply<{ Body: User[] }>
export type UserCreateRequest = FastifyRequest<{ Body: UserDraft }>
export type UserCreateResponse = FastifyReply<{ Body: UserPublic }>
export type UserParamsRequest = FastifyRequest<{ Params: UserParams }>
export type UserGetByIdResponse = FastifyReply<{ Body: UserPublic }>
export type UserPatchByIdRequest = FastifyRequest<{ Body: UserOptional, Params: UserParams }>
export type UserPatchByIdResponse = FastifyReply<{ Body: UserPublic }>
