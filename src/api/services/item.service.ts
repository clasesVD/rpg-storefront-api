import type { FastifyInstance } from 'fastify'
import type { ItemDraft, ItemUpdate } from '../schemas/item.schema'
import { eq } from 'drizzle-orm'
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
    const items = await this.fastify.db
      .select()
      .from(itemTable)
      .leftJoin(itemToCategoryTable, eq(itemTable.id, itemToCategoryTable.itemId))
      .leftJoin(categoryTable, eq(itemToCategoryTable.categoryId, categoryTable.id))
      .execute()

    if (items.length === 0) return []

    const result = items.reduce((acc, { item, category }) => {
      if (!item || !category) return acc

      const existingItem = acc.find((i) => i.id === item.id)

      if (existingItem) existingItem.categoryId.push(category.id)
      else acc.push({ ...item, categoryId: [category.id] })

      return acc
    }, [])

    return result
  }

  async create(draft: ItemDraft) {
    const { categoryId, ...itemDraft } = draft
    const categories = Array.isArray(categoryId) ? categoryId : [categoryId]

    try {
      const [ item ] = await this.fastify.db
        .insert(itemTable)
        .values(itemDraft)
        .returning()

      await this.fastify.db
        .insert(itemToCategoryTable)
        .values(categories.map((categoryId) => ({ itemId: item.id, categoryId })))

      return item
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on item creation')

      throw new InternalServerError('Failed to create item', e)
    }
  }

  async getById(id: string) {
    try {
      const [ item ] = await this.fastify.db
        .select()
        .from(itemTable)
        .where(eq(itemTable.id, id))
        .execute()

      if (!item) {
        throw new NotFoundError(`Item with ID: ${id} does not exist.`)
      }

      const categories = await this.fastify.db
        .select({ categoryId: categoryTable.id })
        .from(itemToCategoryTable)
        .where(eq(itemToCategoryTable.itemId, id))
        .innerJoin(categoryTable, eq(itemToCategoryTable.categoryId, categoryTable.id))
        .execute()

      return {
        ...item,
        categoryId: categories.map((category) => category.categoryId)
      }
    } catch (error) {
      throw new InternalServerError(`Failed to get item with ID: ${id}`, error)
    }
  }

  async patchById(id: string, payload: ItemUpdate) {
    await this.getById(id)

    const { categoryId, ...itemData } = payload
    const categories = Array.isArray(categoryId) ? categoryId : [categoryId]

    try {
      const [ updatedItem ] = await this.fastify.db
        .update(itemTable)
        .set(itemData)
        .where(eq(itemTable.id, id))
        .returning()

      if (categoryId !== undefined) {
        await this.fastify.db
          .delete(itemToCategoryTable)
          .where(eq(itemToCategoryTable.itemId, id))

        await this.fastify.db
          .insert(itemToCategoryTable)
          .values(categories.map((categoryId) => ({ itemId: id, categoryId })))
      }

      return updatedItem
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
