import type { FastifyInstance } from 'fastify'
import { and, eq, sql } from 'drizzle-orm'
import { cartTable, cartToProductTable, productTable } from '../../db'
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
        .select()
        .from(cartTable)
        .execute()

      const cartsWithProducts = await Promise.all(
        carts.map(async (cart) => {
          const products = await this.fastify.db
            .select({
              product: productTable,
              quantity: cartToProductTable.quantity
            })
            .from(cartToProductTable)
            .where(eq(cartToProductTable.cartId, cart.id))
            .innerJoin(
              productTable,
              eq(cartToProductTable.productId, productTable.id)
            )
            .execute()

          return {
            ...cart,
            products
          }
        })
      )

      return cartsWithProducts
    } catch (error) {
      throw new InternalServerError('Failed to get all carts', error)
    }
  }

  async getById(cartId: string) {
    try {
      const [ cart ] = await this.fastify.db
        .select()
        .from(cartTable)
        .where(eq(cartTable.id, cartId))
        .execute()

      if (!cart) {
        throw new NotFoundError(`Cart with ID: ${cartId} does not exist.`)
      }

      const products = await this.fastify.db
        .select({
          product: productTable,
          quantity: cartToProductTable.quantity
        })
        .from(cartToProductTable)
        .where(eq(cartToProductTable.cartId, cartId))
        .innerJoin(
          productTable,
          eq(cartToProductTable.productId, productTable.id)
        )
        .execute()

      return {
        ...cart,
        products
      }
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to get cart with ID: ${cartId}`, error)
    }
  }

  async create(userId: string) {
    try {
      const [ existingCart ] = await this.fastify.db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, userId))
        .execute()

      if (existingCart) return existingCart

      const [ newCart ] = await this.fastify.db
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

      const [ deletedCart ] = await this.fastify.db
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

      const [ product ] = await this.fastify.db
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
}

export default CartService
