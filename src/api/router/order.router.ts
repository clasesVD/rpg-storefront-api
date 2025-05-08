import type { FastifyInstance } from 'fastify'
import OrderController from '../controllers/order.controller'
import { ROLE } from '../../enums/roles'
import {
  orderCreateSchema,
  orderDeleteSchema,
  orderGetAllSchema,
  orderGetByIdSchema
} from '../schemas/orders.schema'

export default async (fastify: FastifyInstance) => {
  const orderController = new OrderController(fastify)
  fastify.addHook('onRequest', async (req, res) => {
    await fastify.authenticate(req, res)
    await fastify.hasRole(ROLE.ADMIN)(req, res)
  })

  fastify.route({
    url: '/',
    method: 'GET',
    schema: orderGetAllSchema,
    handler: orderController.getAll.bind(orderController)
  })

  fastify.route({
    url: '/',
    method: 'POST',
    schema: orderCreateSchema,
    handler: orderController.create.bind(orderController)
  })

  fastify.route({
    url: '/:id',
    method: 'GET',
    schema: orderGetByIdSchema,
    handler: orderController.getById.bind(orderController)
  })

  fastify.route({
    url: '/:id',
    method: 'DELETE',
    schema: orderDeleteSchema,
    handler: orderController.delete.bind(orderController)
  })
}
