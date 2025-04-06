import type { FastifyInstance } from 'fastify'
import { and, eq, sql } from 'drizzle-orm'
import { cartTable, cartToProductTable, productTable } from '../../db'
import type {
  CartDraft,
  CartProductDto,
  CartProductUpdateDto,
  CartParams,
  CartProductParams
} from '../schemas/cart.schema'
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

  async getById(params: CartParams) {
    try {
      const [ cart ] = await this.fastify.db
        .select()
        .from(cartTable)
        .where(eq(cartTable.id, params.id))
        .execute()

      if (!cart) {
        throw new NotFoundError(`Cart with ID: ${params.id} does not exist.`)
      }

      const products = await this.fastify.db
        .select({
          product: productTable,
          quantity: cartToProductTable.quantity
        })
        .from(cartToProductTable)
        .where(eq(cartToProductTable.cartId, params.id))
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
      throw new InternalServerError(`Failed to get cart with ID: ${params.id}`, error)
    }
  }

  async create(draft: CartDraft) {
    try {
      const [ existingCart ] = await this.fastify.db
        .select()
        .from(cartTable)
        .where(eq(cartTable.userId, draft.userId))
        .execute()

      if (existingCart) return existingCart

      const [ newCart ] = await this.fastify.db
        .insert(cartTable)
        .values({ userId: draft.userId })
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

  async delete(params: CartParams) {
    try {
      await this.getById(params)

      const [ deletedCart ] = await this.fastify.db
        .delete(cartTable)
        .where(eq(cartTable.id, params.id))
        .returning()
        .execute()

      return deletedCart
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to delete cart with ID: ${params.id}`, error)
    }
  }

  async addProduct(params: CartParams, dto: CartProductDto) {
    try {
      if (dto.quantity <= 0) {
        throw new BadRequestError('Quantity must be greater than 0')
      }

      await this.getById(params)

      const [ product ] = await this.fastify.db
        .select()
        .from(productTable)
        .where(eq(productTable.id, dto.productId))
        .execute()

      if (!product) {
        throw new NotFoundError(`Product with ID: ${dto.productId} not found`)
      }

      const draft = {
        cartId: params.id,
        productId: dto.productId,
        quantity: dto.quantity
      }

      await this.fastify.db
        .insert(cartToProductTable)
        .values(draft)
        .onConflictDoUpdate({
          target: [cartToProductTable.cartId, cartToProductTable.productId],
          set: {
            [cartToProductTable.quantity.name]: sql`${cartToProductTable.quantity} + ${dto.quantity}`
          }
        })
        .execute()

      return this.getById(params)
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error
      }
      throw new InternalServerError(`Failed to add product with ID: ${dto.productId} to cart`, error)
    }
  }

  async updateProduct(params: CartProductParams, dto: CartProductUpdateDto) {
    try {
      if (dto.quantity < 0) {
        throw new BadRequestError('Quantity cannot be negative')
      }

      if (dto.quantity === 0) {
        return this.removeProduct(params)
      }

      const { rowCount } = await this.fastify.db
        .update(cartToProductTable)
        .set({ [cartToProductTable.quantity.name]: dto.quantity })
        .where(
          and(
            eq(cartToProductTable.cartId, params.cartId),
            eq(cartToProductTable.productId, params.productId)
          )
        )
        .execute()

      if (rowCount === 0) {
        throw new NotFoundError(`Product with ID: ${params.productId} not found in cart`)
      }

      return this.getById({ id: params.cartId })
    } catch (error) {
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        throw error
      }
      throw new InternalServerError(`Failed to update product with ID: ${params.productId} in cart`, error)
    }
  }

  async removeProduct(params: CartProductParams) {
    try {
      const { rowCount } = await this.fastify.db
        .delete(cartToProductTable)
        .where(
          and(
            eq(cartToProductTable.cartId, params.cartId),
            eq(cartToProductTable.productId, params.productId)
          )
        )
        .execute()

      if (rowCount === 0) {
        throw new NotFoundError(`Product with ID: ${params.productId} not found in cart`)
      }

      return this.getById({ id: params.cartId })
    } catch (error) {
      if (error instanceof NotFoundError) throw error
      throw new InternalServerError(`Failed to remove product with ID: ${params.productId} from cart`, error)
    }
  }
}

export default CartService
