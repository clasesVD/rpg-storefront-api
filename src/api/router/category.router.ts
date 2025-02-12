import CategoryController from '../controllers/category.controller'
import type { FastifyInstance } from 'fastify'
import {
  categoryGetAllSchema,
  categoryCreateSchema,
  categoryGetByIdSchema,
  categoryUpdateSchema,
  categoryDeleteSchema
} from '../schemas/category.schema'

export default async (fastify: FastifyInstance) => {
  const categoryController = new CategoryController(fastify)

  fastify.route({
    url: '/',
    method: 'GET',
    schema: categoryGetAllSchema,
    handler: categoryController.get.bind(categoryController)
  })

  fastify.route({
    url: '/',
    method: 'POST',
    schema: categoryCreateSchema,
    handler: categoryController.post.bind(categoryController)
  })

  fastify.route({
    url: '/:id',
    method: 'GET',
    schema: categoryGetByIdSchema,
    handler: categoryController.getById.bind(categoryController)
  })

  fastify.route({
    url: '/:id',
    method: 'PATCH',
    schema: categoryUpdateSchema,
    handler: categoryController.patch.bind(categoryController)
  })

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: categoryDeleteSchema,
    handler: categoryController.delete.bind(categoryController)
  })
}
