import { Type as T, type Static } from "@sinclair/typebox";
import { FastifyReply, FastifyRequest } from "fastify";

export const categorySchema = T.Object({
  id: T.String({ format: "uuid" }),
  name: T.String(),
});

const categoryDraftSchema = T.Omit(categorySchema, ["id"]);

export const categoryGetAllSchema = {
  tags: ["Category"],
  response: {
    200: T.Array(categorySchema),
  },
};

export const categoryCreateSchema = {
  tags: ["Category"],
  request: {
    body: categoryDraftSchema,
  },
  body: categoryDraftSchema,
  response: {
    201: categorySchema,
  },
};

export type Category = Static<typeof categorySchema>;
export type CategoryDraft = Static<typeof categoryDraftSchema>;
export type CategoryGetAll = FastifyReply<{ Body: Category[] }>;
export type CategoryCreateRequest = FastifyRequest<{ Body: Category }>;
