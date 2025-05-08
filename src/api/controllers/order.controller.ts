import type { FastifyInstance } from 'fastify'
import OrderService from '../services/order.service'
import type {
  OrderCreateRequest,
  OrderDeleteRequest,
  OrderGetByIdRequest
} from '../schemas/orders.schema'
import CartService from '../services/cart.service'

class OrderController {
  orderService: OrderService
  cartService: CartService

  constructor(fastify: FastifyInstance) {
    this.orderService = new OrderService(fastify)
    this.cartService = new CartService(fastify)
  }

  async getAll() {
    return this.orderService.getAll()
  }

  async getById(req: OrderGetByIdRequest) {
    const { id } = req.params
    return this.orderService.getById(id)
  }

  async create(req: OrderCreateRequest) {
    const { cartId } = req.body
    const cart = await this.cartService.getById(cartId)
    return this.orderService.create(cart)
  }

  async delete(req: OrderDeleteRequest) {
    const { id } = req.params
    return this.orderService.deleteById(id)
  }
}

export default OrderController
