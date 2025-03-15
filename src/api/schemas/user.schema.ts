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
const userUpdateSchema = T.Partial(userDraftSchema)

export const userGetAllSchema = {
  tags: ['User'],
  response: {
    200: T.Array(userPublicSchema)
  }
}

export const userCreateSchema = {
  tags: ['User'],
  request: {
    body: userDraftSchema
  },
  body: userDraftSchema,
  response: {
    200: userPublicSchema
  }
}

export const userGetByIdSchema = {
  tags: ['User'],
  response: {
    200: userPublicSchema
  }
}

export const userPatchByIdSchema = {
  tags: ['User'],
  request: {
    body: userUpdateSchema
  },
  body: userUpdateSchema,
  response: {
    200: userPublicSchema
  }
}

export const userDeleteByIdSchema = {
  tags: ['User'],
  response: {
    200: userPublicSchema
  }
}

export type User = Static<typeof userSchema>
export type UserDraft = Static<typeof userDraftSchema>
export type UserPublic = Static<typeof userPublicSchema>
export type UserParams = Static<typeof userParamsSchema>
export type UserUpdate = Static<typeof userUpdateSchema>
export type UserGetAll = FastifyReply<{ Body: User[] }>
export type UserCreateRequest = FastifyRequest<{ Body: UserDraft }>
export type UserCreateResponse = FastifyReply<{ Body: UserPublic }>
export type UserParamsRequest = FastifyRequest<{ Params: UserParams }>
export type UserGetByIdResponse = FastifyReply<{ Body: UserPublic }>
export type UserPatchByIdRequest = FastifyRequest<{ Body: UserUpdate, Params: UserParams }>
export type UserPatchByIdResponse = FastifyReply<{ Body: UserPublic }>
export type UserDeleteByIdResponse = FastifyReply<{ Body: UserPublic }>
