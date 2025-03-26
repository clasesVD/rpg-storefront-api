import type { FastifyInstance } from 'fastify'
import ProductService from '../services/product.service'
import type {
  ProductCreateRequest,
  ProductCreateResponse,
  ProductParamsRequest,
  ProductGetByIdResponse,
  ProductPatchByIdRequest,
  ProductPatchByIdResponse,
  ProductDeleteByIdResponse
} from '../schemas/product.schema'

class ProductController {
  productService: ProductService

  constructor(fastify: FastifyInstance) {
    this.productService = new ProductService(fastify)
  }

  async getAll() {
    return this.productService.getAll()
  }

  async create(req: ProductCreateRequest, res: ProductCreateResponse) {
    const result = await this.productService.create(req.body)
    return result[0]
  }

  async getById(req: ProductParamsRequest, res: ProductGetByIdResponse) {
    return this.productService.getById(req.params.id)
  }

  async patchById(req: ProductPatchByIdRequest, res: ProductPatchByIdResponse) {
    return this.productService.patchById(req.params.id, req.body)
  }

  async deleteById(req: ProductParamsRequest, res: ProductDeleteByIdResponse) {
    return this.productService.deleteById(req.params.id)
  }
}

export default ProductController
