import { FastifyInstance } from "fastify";
import CategoryService from "../services/category.service";

class CategoryController {
  categoryService: CategoryService;

  constructor(fastify: FastifyInstance) {
    this.categoryService = new CategoryService(fastify);
  }

  async get() {
    return this.categoryService.get();
  }
}

export default CategoryController;
