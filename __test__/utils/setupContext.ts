import { buildApp } from '../../src/app'
import { randomUUID } from 'crypto'
import type { FastifyInstance } from 'fastify'
import { userTable } from '../../src/db'
import { User } from '../../src/api/schemas/user.schema'

interface TestContext {
  app: FastifyInstance
  idMock: string
  admin: User
  adminToken: string
  customer: User
  customerToken: string
  close: () => Promise<void>
}

export const setupContext = async (): Promise<TestContext> => {
  const app = buildApp()
  await app.ready()

  await (app as any).db.delete(userTable).execute()

  await Promise.all([
    app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'A'
      }
    }),
    app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: {
        name: 'Customer',
        email: 'customer@example.com',
        password: 'cust123',
        role: 'C'
      }
    })
  ])

  const { user: admin, token: adminToken } = await app
    .inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'admin@example.com',
        password: 'admin123'
      }
    })
    .then(res => res.json())

  const { user: customer, token: customerToken } = await app
    .inject({
      method: 'POST',
      url: '/auth/login',
      payload: {
        email: 'customer@example.com',
        password: 'cust123'
      }
    })
    .then(res => res.json())

  return {
    app,
    idMock: randomUUID(),
    admin,
    adminToken,
    customer,
    customerToken,
    close: async () => {
      await app.close()
    }
  }
}
