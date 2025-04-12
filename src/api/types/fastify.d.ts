import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, res: FastifyReply) => Promise<void>
    hasRole: (role: ROLES) => (req: FastifyRequest, res: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: { role: ROLES }
  }
}
