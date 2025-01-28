import fp from 'fastify-plugin'
import { drizzle } from 'drizzle-orm/node-postgres'

declare module 'fastify' {
  interface FastifyInstance {
    db: ReturnType<typeof drizzle>
  }
}

export default fp((fastify, options, done) => {
  const db = drizzle(fastify.config.DATABASE_URL)
  fastify.decorate('db', db)

  done()
})
