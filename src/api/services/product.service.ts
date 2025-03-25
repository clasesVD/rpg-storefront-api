import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { productTable } from '../../db'
import type { ProductDraft, ProductUpdate } from '../schemas/product.schema'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class ProductService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    return this.fastify.db.select().from(productTable).execute()
  }

  async create(draft: ProductDraft) {
    try {
      const result = await this.fastify.db.insert(productTable).values({ ...draft, price: '0.00' }).returning()
      return result
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on product creation')

      throw new InternalServerError('Failed to create product', e)
    }
  }

  async getById(id: string) {
    const result = await this.fastify.db.select().from(productTable).where(eq(productTable.id, id))
    if (!result[0]) throw new NotFoundError(`Product with ID: ${id} does not exist.`)
    return result[0]
  }

  async patchById(id: string, payload: ProductUpdate) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.update(productTable)
        .set({ price: payload.price.toFixed(2) })
        .where(eq(productTable.id, id)).returning()
      return result[0]
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on product update')

      throw new InternalServerError(`Failed to update product with ID: ${id}`, e)
    }
  }

  async deleteById(id: string) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.delete(productTable).where(eq(productTable.id, id)).returning()
      return result[0]
    } catch (e) {
      throw new InternalServerError(`Failed to delete product with ID: ${id}`, e)
    }
  }
}

export default ProductService
