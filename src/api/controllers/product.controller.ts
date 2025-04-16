import type { FastifyInstance } from 'fastify'
import ProductService from '../services/product.service'
import type {
  ProductCreateRequest,
  ProductParamsRequest,
  ProductPatchByIdRequest
} from '../schemas/product.schema'

class ProductController {
  productService: ProductService

  constructor(fastify: FastifyInstance) {
    this.productService = new ProductService(fastify)
  }

  async getAll() {
    return this.productService.getAll()
  }

  async create(req: ProductCreateRequest) {
    const result = await this.productService.create(req.body)
    return result[0]
  }

  async getById(req: ProductParamsRequest) {
    return this.productService.getById(req.params.id)
  }

  async patchById(req: ProductPatchByIdRequest) {
    return this.productService.patchById(req.params.id, req.body)
  }

  async deleteById(req: ProductParamsRequest) {
    return this.productService.deleteById(req.params.id)
  }
}

export default ProductController
