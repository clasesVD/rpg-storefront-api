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

  constructor (fastify: FastifyInstance) {
    this.categoryService = new CategoryService(fastify)
  }

  async getAll () {
    return this.categoryService.get()
  }

  async getById (req: CategoryGetByIdRequest) {
    const { id } = req.params
    return this.categoryService.getById(id)
  }

  async create (req: CategoryCreateRequest) {
    return this.categoryService.post(req.body.name)
  }

  async updateById (req: CategoryUpdateRequest) {
    const { id } = req.params
    const { name } = req.body
    return this.categoryService.patch(id, name)
  }

  async deleteById (req: CategoryDeleteSchema) {
    const { id } = req.params
    return this.categoryService.delete(id)
  }
}

export default CategoryController
