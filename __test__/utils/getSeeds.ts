import type { FastifyInstance } from 'fastify'
import type { Table } from 'drizzle-orm'

export const getAllFrom = async <T = Record<string, unknown>>(
  app: FastifyInstance,
  table: Table
): Promise<T[]> => {
  return (app as any).db.select().from(table).execute() as unknown as T[]
}

export const getOneFrom = async <T = Record<string, unknown>>(
  app: FastifyInstance,
  table: Table
): Promise<T> => {
  return (await (app as any).db.select().from(table).limit(1).execute()).at(0) as T
}
