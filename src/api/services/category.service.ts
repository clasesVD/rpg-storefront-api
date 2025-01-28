import { FastifyInstance } from "fastify";
import { categoriesTable } from "../../db/schema";

class CategoryService {
  fastify: FastifyInstance;

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify;
  }

  async get() {
    return this.fastify.db.select().from(categoriesTable).execute();
  }
}

export default CategoryService;
