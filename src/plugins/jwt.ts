import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import UnauthorizedError from '../api/errors/UnauthorizedError'
import ForbiddenError from '../api/errors/ForbiddenError'
import type { ROLE } from '../enums/roles'
import type { FastifyRequest } from 'fastify'
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
    const allowedRoles = Array.isArray(roles) ? roles : [roles]

    return async function (req: FastifyRequest) {
      let payload: JWTPayload

      try {
        payload = await req.jwtVerify<JWTPayload>()
      } catch {
        throw new UnauthorizedError('Not authenticated.')
      }

      if (!allowedRoles.includes(payload.role))
        throw new ForbiddenError(`Users with role '${payload.role}' cannot perform this operation.`)
    }
  })

  done()
})
