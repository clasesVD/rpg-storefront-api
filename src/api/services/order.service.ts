import type { FastifyInstance } from 'fastify'
import {
  cartTable,
  orderTable,
  orderToItemTable,
  userTable
} from '../../db'
import { eq } from 'drizzle-orm'
import InternalServerError from '../errors/InternalServerError'
import NotFoundError from '../errors/NotFoundError'
import type { Cart } from '../schemas/cart.schema'
import BadRequestError from '../errors/BadRequestError'

class OrderService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    try {
      const orders = await this.fastify.db
        .select({
          order: orderTable,
          item: orderToItemTable
        })
        .from(orderTable)
        .innerJoin(
          orderToItemTable,
          eq(orderTable.id, orderToItemTable.orderId)
        )
        .execute()

      const result = orders.reduce((acc, { order, item }) => {
        const existingOrder = acc.find((o) => o.id === order.id)

        if (existingOrder) existingOrder.products.push(item)
        else acc.push({ ...order, products: [item] })

        return acc
      }, [])
      return result
    } catch (error) {
      throw new InternalServerError('Failed to get all orders', error)
    }
  }

  async getById(orderId: string) {
    try {
      const result = await this.fastify.db
        .select({
          order: orderTable,
          items: orderToItemTable
        })
        .from(orderTable)
        .innerJoin(
          orderToItemTable,
          eq(orderTable.id, orderToItemTable.orderId)
        )
        .where(eq(orderTable.id, orderId))
        .execute()

      if (!result.length) {
        throw new NotFoundError(`Order with ID: ${orderId} does not exist.`)
      }

      return {
        ...result[0].order,
        products: result.map(({ order: _, items }) => items)
      }

    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to get order with ID: ${orderId}`, error)
    }
  }

  async getByUserId(userId: string) {
    try {
      const result = await this.fastify.db
        .select({
          order: orderTable,
          items: orderToItemTable
        })
        .from(orderTable)
        .innerJoin(
          orderToItemTable,
          eq(orderTable.id, orderToItemTable.orderId)
        )
        .where(eq(orderTable.userId, userId))
        .execute()

      if (!result.length) {
        throw new NotFoundError(`Orders of user with ID: ${userId} do not exist.`)
      }

      return {
        ...result[0].order,
        products: result.map(({ order: _, items }) => items)
      }

    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to get orders of user with ID: ${userId}`, error)
    }
  }

  async create(cart: Cart) {
    const [currentUser] = await this.fastify.db
      .select()
      .from(userTable)
      .where(eq(userTable.id, cart.userId))
      .execute()

    try {
      const order = await this.fastify.db.transaction(async (tx) => {
        const [newOrder] = await tx
          .insert(orderTable)
          .values({ userId: cart.userId })
          .returning()
          .execute()

        const [orderItems, totalPrice] = cart.products.reduce((acc, cartItem) => {
          acc[0].push({
            orderId: newOrder.id,
            name: cartItem.item.name,
            description: cartItem.item.description,
            image: cartItem.item.image,
            rarityId: cartItem.rarity.id,
            price: cartItem.product.price,
            quantity: cartItem.quantity
          })
          acc[1] += (+cartItem.product.price) * cartItem.quantity
          return acc
        }, [[], 0])

        if (totalPrice > +currentUser.balance) {
          tx.rollback()
        }

        await tx
          .insert(orderToItemTable)
          .values(orderItems)
          .execute()

        await tx
          .delete(cartTable)
          .where(eq(cartTable.id, cart.id))
          .execute()

        await tx
          .update(userTable)
          .set({
            balance: ((+currentUser.balance) - totalPrice).toFixed(2)
          })
          .where(eq(userTable.id, currentUser.id))
          .execute()

        return newOrder
      })
      return this.getById(order.id)
    } catch (e) {
      if (e.message === 'Rollback') throw new BadRequestError('Insufficient balance')
      throw e
    }
  }

  async deleteById(orderId: string) {
    try {
      await this.getById(orderId)

      const [deletedOrder] = await this.fastify.db
        .delete(orderTable)
        .where(eq(orderTable.id, orderId))
        .returning()
        .execute()

      return deletedOrder
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to delete order with ID: ${orderId}`, error)
    }
  }
}

export default OrderService
