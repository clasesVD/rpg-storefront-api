import CategoryController from "../controllers/category.controller";
import { FastifyInstance } from "fastify";
import { categoryGetAllResponseSchema } from "../schemas/category.schema";

export default async (fastify: FastifyInstance) => {
  const categoryController = new CategoryController(fastify);
  fastify.route({
    url: "/",
    method: "GET",
    schema: categoryGetAllResponseSchema,
    handler: categoryController.get.bind(categoryController),
  });
};
