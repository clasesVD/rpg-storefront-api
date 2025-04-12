import ProductController from '../controllers/product.controller'
import type { FastifyInstance } from 'fastify'
import {
  productGetAllSchema,
  productCreateSchema,
  productGetByIdSchema,
  productPatchByIdSchema,
  productDeleteByIdSchema
} from '../schemas/product.schema'

export default async (fastify: FastifyInstance) => {
  const productController = new ProductController(fastify)
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.route({
    url: '/',
    method: 'GET',
    schema: productGetAllSchema,
    handler: productController.getAll.bind(productController)
  })

  fastify.route({
    url: '/',
    method: 'POST',
    schema: productCreateSchema,
    handler: productController.create.bind(productController)
  })

  fastify.route({
    url: '/:id',
    method: 'GET',
    schema: productGetByIdSchema,
    handler: productController.getById.bind(productController)
  })

  fastify.route({
    url: '/:id',
    method: 'PATCH',
    schema: productPatchByIdSchema,
    handler: productController.patchById.bind(productController)
  })

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: productDeleteByIdSchema,
    handler: productController.deleteById.bind(productController)
  })
}
