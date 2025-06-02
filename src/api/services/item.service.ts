import type { FastifyInstance } from 'fastify'
import type { ItemDraft, ItemUpdate } from '../schemas/item.schema'
import { eq, and, inArray } from 'drizzle-orm'
import { itemTable, itemToCategoryTable, categoryTable } from '../../db'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class ItemService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    const rows = await this.fastify.db
      .select()
      .from(itemTable)
      .innerJoin(itemToCategoryTable, eq(itemTable.id, itemToCategoryTable.itemId))
      .innerJoin(categoryTable, eq(itemToCategoryTable.categoryId, categoryTable.id))
      .execute()

    if (rows.length === 0) return []

    const result = rows.reduce((acc, { item, category }) => {
      const existingItem = acc.find((i) => i.id === item.id)

      if (existingItem) existingItem.categories.push(category)
      else acc.push({ ...item, categories: [category] })

      return acc
    }, [])

    return result
  }

  async create(draft: ItemDraft) {
    const { categories, ...itemDraft } = draft

    if (!categories.length)
      throw new BadRequestError('At least one category is required.')

    try {
      const [ item ] = await this.fastify.db
        .insert(itemTable)
        .values(itemDraft)
        .returning()

      await this.fastify.db
        .insert(itemToCategoryTable)
        .values(categories.map(({ id: categoryId }) => ({ itemId: item.id, categoryId })))

      return this.getById(item.id)
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on item creation')

      throw new InternalServerError('Failed to create item', e)
    }
  }

  async getById(id: string) {
    try {
      const results = await this.fastify.db
        .select()
        .from(itemTable)
        .innerJoin(itemToCategoryTable, eq(itemTable.id, itemToCategoryTable.itemId))
        .innerJoin(categoryTable, eq(itemToCategoryTable.categoryId, categoryTable.id))
        .where(eq(itemTable.id, id))
        .execute()

      if (results.length === 0)
        throw new NotFoundError(`Item with ID: ${id} does not exist.`)

      return {
        ...results[0].item,
        categories: results.map(row => row.category)
      }
    } catch (error) {
      throw new InternalServerError(`Failed to get item with ID: ${id}`, error)
    }
  }

  async patchById(id: string, payload: ItemUpdate) {
    await this.getById(id)

    const { categories, ...itemData } = payload

    try {
      if (Object.keys(itemData).length > 0) {
        await this.fastify.db
          .update(itemTable)
          .set(itemData)
          .where(eq(itemTable.id, id))
          .execute()
      }

      if (categories) {
        const currentRelations = await this.fastify.db
          .select()
          .from(itemToCategoryTable)
          .where(eq(itemToCategoryTable.itemId, id))

        const toDelete = currentRelations
          .filter(rel => !categories.some(cat => cat.id === rel.categoryId))
          .map(rel => rel.categoryId)

        const toInsert = categories
          .filter(cat => !currentRelations.some(rel => rel.categoryId === cat.id))
          .map(cat => cat.id)

        if (toDelete.length) {
          await this.fastify.db
            .delete(itemToCategoryTable)
            .where(
              and(
                eq(itemToCategoryTable.itemId, id),
                inArray(itemToCategoryTable.categoryId, toDelete)
              )
            )
        }

        if (toInsert.length) {
          await this.fastify.db
            .insert(itemToCategoryTable)
            .values(toInsert.map(categoryId => ({ itemId: id, categoryId })))
        }
      }

      return this.getById(id)
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
