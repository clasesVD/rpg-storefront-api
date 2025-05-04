import RarityService from '../services/rarity.service'
import type { FastifyInstance } from 'fastify'

class RarityController {
  rarityService: RarityService

  constructor(fastify: FastifyInstance) {
    this.rarityService = new RarityService(fastify)
  }

  async getAll() {
    return this.rarityService.getAll()
  }
}

export default RarityController
