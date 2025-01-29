import CategoryController from "../controllers/category.controller";
import { FastifyInstance } from "fastify";
import {
  categoryGetAllSchema,
  categoryCreateSchema,
} from "../schemas/category.schema";

export default async (fastify: FastifyInstance) => {
  const categoryController = new CategoryController(fastify);

  fastify.route({
    url: "/",
    method: "GET",
    schema: categoryGetAllSchema,
    handler: categoryController.get.bind(categoryController),
  });

  fastify.route({
    url: "/",
    method: "POST",
    schema: categoryCreateSchema,
    handler: categoryController.post.bind(categoryController),
  });
};
