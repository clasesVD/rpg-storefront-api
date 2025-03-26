import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'
import UnauthorizedError from '../api/errors/UnauthorizedError'

export default fp((fastify, options, done) => {
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    ...options
  })

  fastify.decorate('authenticate', async function (req, res) {
    try {
      await req.jwtVerify()
    } catch (e) {
      throw new UnauthorizedError(e)
    }
  })

  done()
})
