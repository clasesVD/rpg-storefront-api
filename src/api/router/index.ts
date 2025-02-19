import fp from 'fastify-plugin'
import { rootSchema } from '../schemas/root.schema'
import userRouter from './user.router'
import categoryRouter from './category.router'

export default fp((fastify, _, done) => {
  fastify.route({
    url: '/health',
    method: 'GET',
    schema: rootSchema,
    handler: (request, reply) => {
      return { status: 'healthy' }
    }
  })

  fastify.register(userRouter, {
    prefix: '/users'
  })

  fastify.register(categoryRouter, {
    prefix: '/categories'
  })

  done()
})
