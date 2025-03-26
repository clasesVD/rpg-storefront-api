import fp from 'fastify-plugin'
import { rootSchema } from '../schemas/root.schema'
import userRouter from './user.router'
import categoryRouter from './category.router'
import itemRouter from './item.router'
import productRouter from './product.router'

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

  fastify.register(itemRouter, {
    prefix: '/items'
  })

  fastify.register(productRouter, {
    prefix: '/products'
  })

  done()
})
