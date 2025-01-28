import fp from 'fastify-plugin'
import jwt from '@fastify/jwt'

export default fp((fastify, options, done) => {
  fastify.register(jwt, {
    secret: fastify.config.JWT_SECRET,
    ...options
  })

  done()
})
