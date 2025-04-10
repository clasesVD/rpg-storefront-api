import type { FastifyInstance } from 'fastify'
import CartController from '../controllers/cart.controller'
import {
  cartGetAllSchema,
  cartCreateSchema,
  cartGetByIdSchema,
  cartAddProductSchema,
  cartUpdateProductSchema,
  cartRemoveProductSchema,
  cartDeleteSchema
} from '../schemas/cart.schema'

export default async (fastify: FastifyInstance) => {
  const cartController = new CartController(fastify)
  fastify.addHook('onRequest', fastify.authenticate)

  fastify.route({
    url: '/',
    method: 'GET',
    schema: cartGetAllSchema,
    handler: cartController.getAll.bind(cartController)
  })

  fastify.route({
    url: '/',
    method: 'POST',
    schema: cartCreateSchema,
    handler: cartController.create.bind(cartController)
  })

  fastify.route({
    url: '/:id',
    method: 'GET',
    schema: cartGetByIdSchema,
    handler: cartController.getById.bind(cartController)
  })

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: cartDeleteSchema,
    handler: cartController.delete.bind(cartController)
  })

  fastify.route({
    url: '/:id/products',
    method: 'POST',
    schema: cartAddProductSchema,
    handler: cartController.addProduct.bind(cartController)
  })

  fastify.route({
    url: '/:cartId/products/:productId',
    method: 'PATCH',
    schema: cartUpdateProductSchema,
    handler: cartController.updateProduct.bind(cartController)
  })

  fastify.route({
    url: '/:cartId/products/:productId',
    method: 'DELETE',
    schema: cartRemoveProductSchema,
    handler: cartController.removeProduct.bind(cartController)
  })
}
