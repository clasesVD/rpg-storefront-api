import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req, res) => Promise<void>
  }
}
