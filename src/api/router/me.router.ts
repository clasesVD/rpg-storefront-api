import UserController from '../controllers/user.controller'
import type { FastifyInstance } from 'fastify'
import { userPatchMeSchema, userGetMeSchema, userChangePasswordSchema } from '../schemas/user.schema'

export default async (fastify: FastifyInstance) => {
  const userController = new UserController(fastify)
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.route({
    url: '/',
    method: 'GET',
    schema: userGetMeSchema,
    handler: userController.getMe.bind(userController)
  })

  fastify.route({
    url: '/',
    method: 'PATCH',
    schema: userPatchMeSchema,
    handler: userController.patchMe.bind(userController)
  })

  fastify.route({
    url: '/password',
    method: 'POST',
    schema: userChangePasswordSchema,
    handler: userController.changePassword.bind(userController)
  })
}
