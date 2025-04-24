import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { JWTPayload } from './auth.schema'
import { roleEnum } from '../../enums/roles'
import {
  cartItemSchema,
  cartProductParamsMeSchema,
  cartProductUpdateSchema,
  cartPublicSchema
} from './cart.schema'

export const userSchema = T.Object({
  id: T.String({ format: 'uuid' }),
  name: T.String(),
  email: T.String({ format: 'email' }),
  password: T.String(),
  balance: T.String(),
  role: roleEnum
})

const userPasswordSchema = T.Object({
  oldPassword: T.String(),
  newPassword: T.String()
})

export const userDraftSchema = T.Omit(userSchema, ['id', 'balance'])
export const userPublicSchema = T.Omit(userSchema, ['password'])
export const userParamsSchema = T.Pick(userSchema, ['id'])
const userUpdateSchema = T.Partial(T.Omit(userSchema, ['id']))
const updateMeSchema = T.Partial(T.Omit(userDraftSchema, ['password']))

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

export const meGetSchema = {
  tags: ['Me'],
  response: {
    200: T.Object({
      user: userPublicSchema,
      cart: cartPublicSchema
      //orders
    })
  }
}

export const mePatchSchema = {
  tags: ['Me'],
  request: {
    body: updateMeSchema
  },
  body: updateMeSchema,
  response: {
    200: userPublicSchema
  }
}

export const meChangePasswordSchema = {
  tags: ['Me'],
  request: {
    body: userPasswordSchema
  },
  body: userPasswordSchema,
  response: {
    200: T.Object({
      message: T.String()
    })
  }
}

export const meAddProductSchema = {
  tags: ['Me'],
  request: {
    body: cartItemSchema
  },
  body: cartItemSchema,
  response: {
    200: cartPublicSchema
  }
}

export const meChangeProductQuantitySchema = {
  tags: ['Me'],
  request: {
    body: cartProductUpdateSchema,
    params: cartProductParamsMeSchema
  },
  body: cartProductUpdateSchema,
  response: {
    200: cartPublicSchema
  }
}

export const meDeleteCartSchema = {
  tags: ['Me'],
  response: {
    200: T.Object({
      message: T.String()
    })
  }
}

export type User = Static<typeof userSchema>
export type UserDraft = Static<typeof userDraftSchema>
export type UserPublic = Static<typeof userPublicSchema>
export type UserParams = Static<typeof userParamsSchema>
export type UserUpdate = Static<typeof userUpdateSchema>
export type UserPatchMe = Static<typeof updateMeSchema>
export type UserChangePassword = Static<typeof userPasswordSchema>
export type UserGetAll = FastifyReply<{ Body: User[] }>
export type UserCreateRequest = FastifyRequest<{ Body: UserDraft }>
export type UserParamsRequest = FastifyRequest<{ Params: UserParams }>
export type UserPatchByIdRequest = FastifyRequest<{ Body: UserUpdate, Params: UserParams }>
export type UserGetMeRequest = FastifyRequest & { user: JWTPayload }
export type UserPatchMeRequest = FastifyRequest<{ Body: UserPatchMe }> & { user: JWTPayload }
export type UserChangePasswordRequest = FastifyRequest<{ Body: UserChangePassword }> & { user: JWTPayload }
export type UserDeleteCartRequest = FastifyRequest & { user: JWTPayload }
