import UserController from '../controllers/user.controller'
import type { FastifyInstance } from 'fastify'
import {
  userGetAllSchema,
  userCreateSchema,
  userGetByIdSchema,
  userPatchByIdSchema,
  userDeleteByIdSchema
} from '../schemas/user.schema'
import { ROLE } from '../../enums/roles'

export default async (fastify: FastifyInstance) => {
  const userController = new UserController(fastify)
  fastify.addHook('onRequest', async (req, res) => {
    await fastify.authenticate(req, res)
    await fastify.hasRole(ROLE.ADMIN)(req, res)
  })

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

  fastify.route({
    url: '/:id',
    method: 'GET',
    schema: userGetByIdSchema,
    handler: userController.getById.bind(userController)
  })

  fastify.route({
    url: '/:id',
    method: 'PATCH',
    schema: userPatchByIdSchema,
    handler: userController.patchById.bind(userController)
  })

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: userDeleteByIdSchema,
    handler: userController.deleteById.bind(userController)
  })
}
