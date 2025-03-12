import type { FastifyInstance } from 'fastify'
import { categoriesTable } from '../../db/schema'
import { eq } from 'drizzle-orm'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class CategoryService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    return this.fastify.db.select().from(categoriesTable).execute()
  }

  async getById(id: string) {
    const result = await this.fastify.db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .execute()
    if (!result[0]) throw new NotFoundError(`Category with ID: ${id} does not exist.`)
    return result[0]
  }

  async create(name: string) {
    try {
      const result = await this.fastify.db
        .insert(categoriesTable)
        .values({ name })
        .returning()
        .execute()
      return result[0]
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on category creation')

      throw new InternalServerError('Failed to create category', e)
    }
  }

  async updateById(id: string, name: string) {
    await this.getById(id)
    try {
      const result = await this.fastify.db
        .update(categoriesTable)
        .set({ name })
        .where(eq(categoriesTable.id, id))
        .returning()
        .execute()
      return result[0]
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on category update')

      throw new InternalServerError(`Failed to update category with ID: ${id}`, e)
    }
  }

  async deleteById(id: string) {
    await this.getById(id)
    try {
      const result = await this.fastify.db
        .delete(categoriesTable)
        .where(eq(categoriesTable.id, id))
        .returning()
        .execute()
      return result[0]
    } catch (e) {
      throw new InternalServerError(`Failed to delete category with ID:${id}`, e)
    }
  }
}

export default CategoryService
