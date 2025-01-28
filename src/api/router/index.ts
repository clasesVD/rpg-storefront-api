import fp from "fastify-plugin";
import { rootSchema } from "../schemas/root.schema";
import userRouter from "./user.router";
import categoryRouter from "./category.router";

export default fp((fastify, _, done) => {
  fastify.route({
    url: "/ping",
    method: "GET",
    schema: rootSchema,
    handler: (request, reply) => {
      return { pong: "Hello World!" };
    },
  });

  fastify.register(userRouter, {
    prefix: "/users",
  });

  fastify.register(categoryRouter, {
    prefix: "/categories",
  });

  done();
});
