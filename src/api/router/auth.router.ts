import AuthController from '../controllers/auth.controller'
import type { FastifyInstance } from 'fastify'
import { registerSchema, loginSchema } from '../schemas/auth.schema'

export default async (fastify: FastifyInstance) => {
  const authController = new AuthController(fastify)
  fastify.route({
    url: '/register',
    method: 'POST',
    schema: registerSchema,
    handler: authController.register.bind(authController)
  })

  fastify.route({
    url: '/login',
    method: 'POST',
    schema: loginSchema,
    handler: authController.login.bind(authController)
  })
}

