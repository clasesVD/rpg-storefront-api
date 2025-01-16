import fp from 'fastify-plugin'
import cors from '@fastify/cors'

export default fp((fastify, options, done) => {
  fastify.register(cors, options)

  done()
})
