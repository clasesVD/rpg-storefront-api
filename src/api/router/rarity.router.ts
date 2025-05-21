import RarityController from '../controllers/rarity.controller'
import type { FastifyInstance } from 'fastify'
import { rarityGetAllSchema } from '../schemas/rarity.schema'
import { ROLE } from '../../enums/roles'

export default async (fastify: FastifyInstance) => {
  const rarityController = new RarityController(fastify)
  fastify.addHook('onRequest', fastify.hasPermission(ROLE.ADMIN))

  fastify.route({
    url: '/',
    method: 'GET',
    schema: rarityGetAllSchema,
    handler: rarityController.getAll.bind(rarityController)
  })
}
