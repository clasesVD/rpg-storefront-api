import fp from 'fastify-plugin'
import { rootSchema } from '../schemas/root.schema'

export default fp((fastify, _, done) => {
  fastify.route({
    url: '/ping',
    method: 'GET',
    schema: rootSchema,
    handler: (request, reply) => {
      return { pong: 'Hello World!' }
    }
  })

  done()
})
