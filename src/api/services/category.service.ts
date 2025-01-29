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

  async post(name: string) {
    return this.fastify.db
      .insert(categoriesTable)
      .values({ name })
      .returning()
      .execute();
  }
}

export default CategoryService;
