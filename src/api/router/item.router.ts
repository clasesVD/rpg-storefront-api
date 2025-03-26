import ItemController from '../controllers/item.controller'
import type { FastifyInstance } from 'fastify'
import {
  itemGetAllSchema,
  itemCreateSchema,
  itemGetByIdSchema,
  itemPatchByIdSchema,
  itemDeleteByIdSchema
} from '../schemas/item.schema'

export default async (fastify: FastifyInstance) => {
  const itemController = new ItemController(fastify)
  fastify.route({
    url: '/',
    method: 'GET',
    schema: itemGetAllSchema,
    handler: itemController.getAll.bind(itemController)
  })

  fastify.route({
    url: '/',
    method: 'POST',
    schema: itemCreateSchema,
    handler: itemController.create.bind(itemController)
  })

  fastify.route({
    url: '/:id',
    method: 'GET',
    schema: itemGetByIdSchema,
    handler: itemController.getById.bind(itemController)
  })

  fastify.route({
    url: '/:id',
    method: 'PATCH',
    schema: itemPatchByIdSchema,
    handler: itemController.patchById.bind(itemController)
  })

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: itemDeleteByIdSchema,
    handler: itemController.deleteById.bind(itemController)
  })
}
