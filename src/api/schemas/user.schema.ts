import { Type as T, type Static } from '@sinclair/typebox'
import type { FastifyReply } from 'fastify'

export const userSchema = T.Object({
    id: T.Number(),
    name: T.String(),
    email: T.String({ format:'email' }),
    password: T.String(),
    balance: T.String()
})

export const userGetAllResponseSchema = {
  response: {
    200: T.Array(userSchema)
  }
}

export type User = Static<typeof userSchema>
export type UserGetAllResponse = FastifyReply<{ Body:User[] }>
