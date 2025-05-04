import type { FastifyInstance } from 'fastify'
import { rarityTable } from '../../db'

class RarityService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    return this.fastify.db.select().from(rarityTable).execute()
  }
}

export default RarityService
