import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply } from 'fastify'

export const userSchema = T.Object({
  id: T.Number(),
  name: T.String(),
  age: T.Number(),
  email: T.String()
})

export const userGetAllResponseSchema = {
  response: {
    200: T.Array(userSchema)
  }
}

export type User = Static<typeof userSchema>
export type UserGetAllResponse = FastifyReply<{ Body:User[] }>
