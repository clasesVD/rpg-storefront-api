import UserController from '../controllers/user.controller'
import type { FastifyInstance } from 'fastify'
import {
  mePatchSchema,
  meGetSchema,
  meChangePasswordSchema,
  meAddProductSchema,
  meChangeProductQuantitySchema,
  meDeleteCartSchema
} from '../schemas/user.schema'
import CartController from '../controllers/cart.controller'
import { ROLE } from '../../enums/roles'

export default async (fastify: FastifyInstance) => {
  const userController = new UserController(fastify)
  const cartController = new CartController(fastify)

  fastify.addHook('onRequest', fastify.hasPermission([ROLE.ADMIN, ROLE.CUSTOMER]))

  fastify.route({
    url: '/',
    method: 'GET',
    schema: meGetSchema,
    handler: userController.getMe.bind(userController)
  })

  fastify.route({
    url: '/',
    method: 'PATCH',
    schema: mePatchSchema,
    handler: userController.patchMe.bind(userController)
  })

  fastify.route({
    url: '/password',
    method: 'POST',
    schema: meChangePasswordSchema,
    handler: userController.changePassword.bind(userController)
  })

  fastify.route({
    url: '/cart',
    method: 'POST',
    schema: meAddProductSchema,
    handler: cartController.addProductMe.bind(cartController)
  })

  fastify.route({
    url: '/cart/:productId',
    method: 'PATCH',
    schema: meChangeProductQuantitySchema,
    handler: cartController.updateProductMe.bind(cartController)
  })

  fastify.route({
    url: '/cart',
    method: 'DELETE',
    schema: meDeleteCartSchema,
    handler: userController.deleteMeCart.bind(userController)
  })
}
