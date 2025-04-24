import type { FastifyInstance } from 'fastify'
import CartService from '../services/cart.service'
import type {
  CartAddProductMeRequest,
  CartAddProductRequest,
  CartCreateRequest,
  CartDeleteRequest,
  CartGetByIdRequest,
  CartRemoveProductRequest,
  CartUpdateProductMeRequest,
  CartUpdateProductRequest
} from '../schemas/cart.schema'

class CartController {
  cartService: CartService

  constructor(fastify: FastifyInstance) {
    this.cartService = new CartService(fastify)
  }

  async getAll() {
    return this.cartService.getAll()
  }

  async getById(req: CartGetByIdRequest) {
    const { userId } = req.body
    return this.cartService.getById(userId)
  }

  async create(req: CartCreateRequest) {
    const { userId } = req.body
    return this.cartService.create(userId)
  }

  async addProduct(req: CartAddProductRequest) {
    const { id } = req.params
    return this.cartService.addProduct(id, req.body)
  }

  async updateProduct(req: CartUpdateProductRequest) {
    const { cartId, productId } = req.params
    const { quantity } = req.body
    return this.cartService.updateProduct(cartId, productId, quantity)
  }

  async removeProduct(req: CartRemoveProductRequest) {
    const { cartId, productId } = req.params
    return this.cartService.removeProduct(cartId, productId)
  }

  async delete(req: CartDeleteRequest) {
    const { id } = req.params
    return this.cartService.deleteById(id)
  }

  async addProductMe(req: CartAddProductMeRequest) {
    const userId = req.user.sub
    let cart = await this.cartService.getByUserId(userId).catch(() => null)
    const cartItem = req.body

    if (!cart) {
      cart = await this.cartService.create(userId)
    }

    return this.cartService.addProduct(cart.id, cartItem)
  }

  async updateProductMe(req: CartUpdateProductMeRequest) {
    const userId = req.user.sub
    const { productId } = req.params
    const { quantity } = req.body
    const cart = await this.cartService.getByUserId(userId)

    return this.cartService.updateProduct(cart.id, productId, quantity)
  }
}

export default CartController
