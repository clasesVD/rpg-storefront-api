import 'fastify'
import type { Role } from '../../enums/roles'
import type { drizzle } from 'drizzle-orm/node-postgres'
import type { FastifyJWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyInstance {
    hasPermission: (role: Role | Role[]) => (req: FastifyRequest, res: FastifyReply) => Promise<void>,
    db: ReturnType<typeof drizzle>
    jwt: FastifyJWT
  }

  interface FastifyRequest {
    user: { role: Role }
  }
}
