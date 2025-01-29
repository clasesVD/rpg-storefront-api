import UserController from '../controllers/user.controller'
import { FastifyInstance } from 'fastify'
import { userGetAllResponseSchema } from '../schemas/user.schema'

export default async (fastify: FastifyInstance) => {
  const userController = new UserController(fastify)
  fastify.route({
    url: '/',
    method: 'GET',
    schema: userGetAllResponseSchema,
    handler: userController.get.bind(userController),
  })
}
