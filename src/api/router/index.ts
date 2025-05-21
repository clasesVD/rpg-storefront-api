import fp from 'fastify-plugin'
import { rootSchema } from '../schemas/root.schema'
import userRouter from './user.router'
import categoryRouter from './category.router'
import itemRouter from './item.router'
import productRouter from './product.router'
import authRouter from './auth.router'
import meRouter from './me.router'
import cartRouter from './cart.router'
import rarityRouter from './rarity.router'
import orderRouter from './order.router'

export default fp((fastify, _, done) => {
  fastify.route({
    url: '/health',
    method: 'GET',
    schema: rootSchema,
    handler: (request, reply) => {
      return { status: 'healthy' }
    }
  })

  fastify.register(authRouter, {
    prefix: '/auth'
  })

  fastify.register(meRouter, {
    prefix: '/me'
  })

  fastify.register(userRouter, {
    prefix: '/users'
  })

  fastify.register(categoryRouter, {
    prefix: '/categories'
  })

  fastify.register(rarityRouter, {
    prefix: '/rarities'
  })

  fastify.register(itemRouter, {
    prefix: '/items'
  })

  fastify.register(productRouter, {
    prefix: '/products'
  })

  fastify.register(cartRouter, {
    prefix: '/carts'
  })

  fastify.register(orderRouter, {
    prefix: '/orders'
  })

  done()
})
