import 'fastify'

declare module 'fastify' {
  interface FastifyInstance {
    hasPermission: (role: ROLES) => (req: FastifyRequest, res: FastifyReply) => Promise<void>
  }

  interface FastifyRequest {
    user: { role: ROLES }
  }
}
