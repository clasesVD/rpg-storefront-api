import type { FastifyInstance } from 'fastify'
import { categoriesTable } from '../../db/schema'
import { eq } from 'drizzle-orm'

class CategoryService {
  fastify: FastifyInstance

  constructor (fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async get () {
    return this.fastify.db.select().from(categoriesTable).execute()
  }

  async getById (id: string) {
    const result = await this.fastify.db
      .select()
      .from(categoriesTable)
      .where(eq(categoriesTable.id, id))
      .execute()
    return result[0]
  }

  async post (name: string) {
    return this.fastify.db
      .insert(categoriesTable)
      .values({ name })
      .returning()
      .execute()
  }

  async patch (id: string, name: string) {
    return this.fastify.db
      .update(categoriesTable)
      .set({ name })
      .where(eq(categoriesTable.id, id))
      .returning()
      .execute()
  }
}

export default CategoryService
