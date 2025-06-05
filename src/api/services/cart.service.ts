import type { FastifyInstance } from 'fastify'
import { and, eq, sql } from 'drizzle-orm'
import {
  cartTable,
  cartToProductTable,
  itemTable,
  productTable,
  rarityTable
} from '../../db'
import type { CartItem } from '../schemas/cart.schema'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class CartService {
  private readonly fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    try {
      const carts = await this.fastify.db
        .select({
          cart: cartTable,
          product: productTable,
          quantity: sql<number>`COALESCE(${cartToProductTable.quantity}, 0)`,
          rarity: rarityTable,
          item: itemTable
        })
        .from(cartTable)
        .leftJoin(
          cartToProductTable,
          eq(cartTable.id, cartToProductTable.cartId)
        )
        .leftJoin(
          productTable,
          eq(cartToProductTable.productId, productTable.id)
        )
        .leftJoin(
          itemTable,
          eq(productTable.itemId, itemTable.id)
        )
        .leftJoin(
          rarityTable,
          eq(productTable.rarityId, rarityTable.id)
        )
        .execute()

      const result = carts.reduce((acc, { cart, ...cartItem }) => {
        const existingCart = acc.find((c) => c.id === cart.id)

        if (existingCart) existingCart.products.push(cartItem)
        else acc.push({ ...cart, products: [cartItem] })

        return acc
      }, [])

      return result
    } catch (error) {
      throw new InternalServerError('Failed to get all carts', error)
    }
  }

  async getById(cartId: string) {
    try {
      const result = await this.fastify.db
        .select({
          cart: cartTable,
          product: productTable,
          quantity: sql<number>`COALESCE(${cartToProductTable.quantity}, 0)`,
          rarity: rarityTable,
          item: itemTable
        })
        .from(cartTable)
        .leftJoin(
          cartToProductTable,
          eq(cartTable.id, cartToProductTable.cartId)
        )
        .leftJoin(
          productTable,
          eq(cartToProductTable.productId, productTable.id)
        )
        .leftJoin(
          itemTable,
          eq(productTable.itemId, itemTable.id)
        )
        .leftJoin(
          rarityTable,
          eq(productTable.rarityId, rarityTable.id)
        )
        .where(eq(cartTable.id, cartId))
        .execute()

      if (!result.length) {
        throw new NotFoundError(`Cart with ID: ${cartId} does not exist.`)
      }

      return {
        ...result[0].cart,
        products: result.map(({ cart: _, ...products }) => products)
      }

    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to get cart with ID: ${cartId}`, error)
    }
  }

  async getByUserId(userId: string) {
    try {
      const result = await this.fastify.db
        .select({
          cart: cartTable,
          product: productTable,
          quantity: sql<number>`COALESCE(${cartToProductTable.quantity}, 0)`,
          rarity: rarityTable,
          item: itemTable
        })
        .from(cartTable)
        .leftJoin(
          cartToProductTable,
          eq(cartTable.id, cartToProductTable.cartId)
        )
        .leftJoin(
          productTable,
          eq(cartToProductTable.productId, productTable.id)
        )
        .leftJoin(
          itemTable,
          eq(productTable.itemId, itemTable.id)
        )
        .leftJoin(
          rarityTable,
          eq(productTable.rarityId, rarityTable.id)
        )
        .where(eq(cartTable.userId, userId))
        .execute()

      if (!result.length) {
        throw new NotFoundError(`Cart for the userID: ${userId} does not exist.`)
      }

      return {
        ...result[0].cart,
        products: result.map(({ cart: _, ...products }) => products)
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to get cart for user with ID: ${userId}`, error)
    }
  }

  async create(userId: string) {
    try {
      const [existingCart] = await this.fastify.db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, userId))
        .execute()

      if (existingCart) return existingCart

      const [newCart] = await this.fastify.db
        .insert(cartTable)
        .values({ userId: userId })
        .returning()
        .execute()

      return {
        ...newCart,
        products: []
      }
    } catch (error) {
      if (error.message.startsWith('syntax error')) {
        throw new BadRequestError('Invalid fields on cart creation')
      }
      throw new InternalServerError('Failed to create cart', error)
    }
  }

  async deleteById(cartId: string) {
    try {
      await this.getById(cartId)

      const [deletedCart] = await this.fastify.db
        .delete(cartTable)
        .where(eq(cartTable.id, cartId))
        .returning()
        .execute()

      return deletedCart
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to delete cart with ID: ${cartId}`, error)
    }
  }

  async addProduct(cartId: string, cartItem: CartItem) {
    try {
      if (cartItem.quantity <= 0) {
        throw new BadRequestError('Quantity must be greater than 0')
      }

      await this.getById(cartId)

      const [product] = await this.fastify.db
        .select()
        .from(productTable)
        .where(eq(productTable.id, cartItem.productId))
        .execute()

      if (!product) {
        throw new NotFoundError(`Product with ID: ${cartItem.productId} not found`)
      }

      const draft = {
        cartId: cartId,
        productId: cartItem.productId,
        quantity: cartItem.quantity
      }

      await this.fastify.db
        .insert(cartToProductTable)
        .values(draft)
        .onConflictDoUpdate({
          target: [cartToProductTable.cartId, cartToProductTable.productId],
          set: {
            [cartToProductTable.quantity.name]: sql`${cartToProductTable.quantity} + ${cartItem.quantity}`
          }
        })
        .execute()

      return this.getById(cartId)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error
      }
      throw new InternalServerError(`Failed to add product with ID: ${cartItem.productId} to cart`, error)
    }
  }

  async updateProduct(cartId: string, productId: string, quantity: number) {
    try {
      if (quantity <= 0) {
        return this.removeProduct(cartId, productId)
      }

      const { rowCount } = await this.fastify.db
        .update(cartToProductTable)
        .set({ [cartToProductTable.quantity.name]: quantity })
        .where(
          and(
            eq(cartToProductTable.cartId, cartId),
            eq(cartToProductTable.productId, productId)
          )
        )
        .execute()

      if (rowCount === 0) {
        throw new NotFoundError(`Product with ID: ${productId} not found in cart`)
      }

      return this.getById(cartId)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error
      }
      throw new InternalServerError(`Failed to update product with ID: ${productId} in cart`, error)
    }
  }

  async removeProduct(cartId: string, productId: string) {
    try {
      const { rowCount } = await this.fastify.db
        .delete(cartToProductTable)
        .where(
          and(
            eq(cartToProductTable.cartId, cartId),
            eq(cartToProductTable.productId, productId)
          )
        )
        .execute()

      if (rowCount === 0) {
        throw new NotFoundError(`Product with ID: ${productId} not found in cart`)
      }

      return this.getById(cartId)
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to remove product with ID: ${productId} from cart`, error)
    }
  }

  async deleteByUserId(userId: string) {
    try {
      const cart = await this.getByUserId(userId)
      const deleted = await this.deleteById(cart.id)
      return deleted
    } catch (error) {
      throw new InternalServerError(`Failed to delete cart for user with ID: ${userId}`, error)
    }
  }
}

export default CartService
