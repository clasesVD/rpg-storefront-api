import type { FastifyInstance } from 'fastify'
import type { ItemDraft, ItemUpdate } from '../schemas/item.schema'
import { eq } from 'drizzle-orm'
import { itemTable } from '../../db'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class ItemService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    return this.fastify.db.select().from(itemTable).execute()
  }

  async create(draft: ItemDraft) {
    try {
      const result = await this.fastify.db.insert(itemTable).values(draft).returning()
      return result
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on item creation')

      throw new InternalServerError('Failed to create item', e)
    }
  }

  async getById(id: string) {
    const result = await this.fastify.db.select().from(itemTable).where(eq(itemTable.id, id))
    if (!result[0]) throw new NotFoundError(`Item with ID: ${id} does not exist.`)
    return result[0]
  }

  async patchById(id: string, payload: ItemUpdate) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.update(itemTable).set(payload).where(eq(itemTable.id, id)).returning()
      return result[0]
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on item update')

      throw new InternalServerError(`Failed to update item with ID: ${id}`, e)
    }
  }

  async deleteById(id: string) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.delete(itemTable).where(eq(itemTable.id, id)).returning()
      return result[0]
    } catch (e) {
      throw new InternalServerError(`Failed to delete item with ID: ${id}`, e)
    }
  }
}

export default ItemService
