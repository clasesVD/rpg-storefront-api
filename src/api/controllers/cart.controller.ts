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
    return this.cartService.getById(req.params)
  }

  async create(req: CartCreateRequest) {
    return this.cartService.create(req.body)
  }

  async addProduct(req: CartAddProductRequest) {
    return this.cartService.addProduct(req.params, req.body)
  }

  async updateProduct(req: CartUpdateProductRequest) {
    return this.cartService.updateProduct(req.params, req.body)
  }

  async removeProduct(req: CartRemoveProductRequest) {
    return this.cartService.removeProduct(req.params)
  }

  async delete(req: CartDeleteRequest) {
    return this.cartService.delete(req.params)
  }
}

export default CartController
