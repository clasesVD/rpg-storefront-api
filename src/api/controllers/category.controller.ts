import { FastifyInstance } from "fastify";
import CategoryService from "../services/category.service";
import { CategoryCreateRequest } from "../schemas/category.schema";

class CategoryController {
  categoryService: CategoryService;

  constructor(fastify: FastifyInstance) {
    this.categoryService = new CategoryService(fastify);
  }

  async get() {
    return this.categoryService.get();
  }

  async post(req: CategoryCreateRequest) {
    return this.categoryService.post(req.body.name);
  }
}

export default CategoryController;
