import type { FastifyInstance } from 'fastify'
import CategoryService from '../services/category.service'
import type {
  CategoryCreateRequest,
  CategoryDeleteSchema,
  CategoryGetByIdRequest,
  CategoryUpdateRequest
} from '../schemas/category.schema'

class CategoryController {
  categoryService: CategoryService

  constructor(fastify: FastifyInstance) {
    this.categoryService = new CategoryService(fastify)
  }

  async getAll() {
    return this.categoryService.getAll()
  }

  async getById(req: CategoryGetByIdRequest) {
    const { id } = req.params
    return this.categoryService.getById(id)
  }

  async create(req: CategoryCreateRequest) {
    return this.categoryService.create(req.body.name)
  }

  async updateById(req: CategoryUpdateRequest) {
    const { id } = req.params
    const { name } = req.body
    return this.categoryService.updateById(id, name)
  }

  async deleteById(req: CategoryDeleteSchema) {
    const { id } = req.params
    return this.categoryService.deleteById(id)
  }
}

export default CategoryController
