import AuthController from '../controllers/auth.controller'
import type { FastifyInstance } from 'fastify'

export default async (fastify: FastifyInstance) => {
  const authController = new AuthController(fastify)
  fastify.route({
    url: '/register',
    method: 'POST',
    //schema: userCreateSchema,
    handler: authController.register.bind(authController)
  })
}

