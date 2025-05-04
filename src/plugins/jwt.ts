import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import UnauthorizedError from '../api/errors/UnauthorizedError'
import ForbiddenError from '../api/errors/ForbiddenError'
import type { ROLE } from '../enums/roles'
import type { FastifyRequest } from 'fastify'
import { userTable } from '../db'
import { eq } from 'drizzle-orm'
import type { JWTPayload } from '../api/schemas/auth.schema'

export default fp((fastify, options, done) => {
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    ...options
  })

  fastify.decorate('authenticate', async function (req) {
    try {
      await req.jwtVerify()
    } catch (e) {
      throw new UnauthorizedError(e)
    }
  })

  fastify.decorate('hasRole', function (roles: ROLE | ROLE[]) {
    const allowedRoles: ROLE[] = Array.isArray(roles) ? roles : [roles]

    return async function (req: FastifyRequest) {
      let payload: JWTPayload
      try {
        payload = await req.jwtVerify<JWTPayload>()
      } catch {
        throw new UnauthorizedError('Invalid or missing token.')
      }

      const [ user ] = await fastify.db
        .select()
        .from(userTable)
        .where(eq(userTable.id, payload.sub))

      if (!user) {
        throw new UnauthorizedError('User not found.')
      }

      if (!allowedRoles.includes(user.role as ROLE)) {
        throw new ForbiddenError(`User with role '${user.role}' cannot perform this operation.`)
      }
    }
  })

  done()
})
