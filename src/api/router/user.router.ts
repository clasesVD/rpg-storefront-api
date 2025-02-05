import UserController from '../controllers/user.controller'
import type { FastifyInstance } from 'fastify'
import { userGetAllSchema, userCreateSchema } from '../schemas/user.schema'

export default async (fastify: FastifyInstance) => {
  const userController = new UserController(fastify)
  fastify.route({
    url: '/',
    method: 'GET',
    schema: userGetAllSchema,
    handler: userController.getAll.bind(userController)
  })

  fastify.route({
    url: '/',
    method: 'POST',
    schema: userCreateSchema,
    handler: userController.create.bind(userController)
  })
}
