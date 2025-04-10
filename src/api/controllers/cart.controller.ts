import type { FastifyInstance } from 'fastify'
import CartService from '../services/cart.service'
import type {
  CartAddProductRequest,
  CartCreateRequest,
  CartDeleteRequest,
  CartGetByIdRequest,
  CartRemoveProductRequest,
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
}

export default CartController
