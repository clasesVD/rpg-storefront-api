import { Type as T, type Static } from "@sinclair/typebox";
import { FastifyReply } from "fastify";

export const categorySchema = T.Object({
  id: T.String({ format: "uuid" }),
  name: T.String(),
});

export const categoryGetAllResponseSchema = {
  response: {
    200: T.Array(categorySchema),
  },
};

export type Category = Static<typeof categorySchema>;
export type CategoryGetAllResponse = FastifyReply<{ Body: Category[] }>;
