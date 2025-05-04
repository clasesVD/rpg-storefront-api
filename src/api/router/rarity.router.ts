import RarityController from '../controllers/rarity.controller'
import type { FastifyInstance } from 'fastify'
import { rarityGetAllSchema } from '../schemas/rarity.schema'
import { ROLE } from '../../enums/roles'

export default async (fastify: FastifyInstance) => {
  const rarityController = new RarityController(fastify)
  fastify.addHook('onRequest', async (req, res) => {
    await fastify.authenticate(req, res)
    await fastify.hasRole(ROLE.ADMIN)(req, res)
  })

  fastify.route({
    url: '/',
    method: 'GET',
    schema: rarityGetAllSchema,
    handler: rarityController.getAll.bind(rarityController)
  })
}
