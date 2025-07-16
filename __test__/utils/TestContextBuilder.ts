import type { FastifyInstance } from 'fastify'
import type { Table } from 'drizzle-orm'
import { randomUUID } from 'crypto'
import { buildApp } from '../../src/app'
import type { User } from '../../src/api/schemas/user.schema'

export interface TestContextUser extends User {
  token: string;
}

export interface TestContext {
  app: FastifyInstance;
  users: {
    admin?: TestContextUser;
    customer?: TestContextUser;
    [key: string]: TestContextUser | undefined;
  };
  mocks: {
    id: string;
    [key: string]: unknown;
  };
  db: {
    getAllRecordsFrom: <T extends Record<string, unknown>>(table: Table) => Promise<T[]>;
    getOneRecordFrom: <T extends Record<string, unknown>>(table: Table) => Promise<T>;
  };
}

export class TestContextBuilder {
  private static appInstance: FastifyInstance | null = null
  private app!: FastifyInstance

  private shouldLoadAdmin = false
  private shouldLoadCustomer = false

  private ctx: Omit<TestContext, 'app'> = {
    mocks: { id: randomUUID() },
    users: {},
    db: {
      getAllRecordsFrom: async () => [],
      getOneRecordFrom: async () => null
    }
  }

  private static init = async (): Promise<FastifyInstance> => {
    if (!this.appInstance) {
      this.appInstance = buildApp()
      await this.appInstance.ready()
    }
    return this.appInstance
  }

  private isTokenValid = (token: string): boolean => {
    try {
      this.app.jwt.verify(token)
      return true
    } catch {
      return false
    }
  }

  private loginUser = async (key: keyof TestContext['users'], payload: { email: string; password: string }) => {
    const cached = this.ctx.users[key]
    const valid = cached?.token && this.isTokenValid(cached.token)

    if (!valid) {
      const res = await this.app.inject({
        method: 'POST',
        url: '/auth/login',
        payload
      })

      const { user, token } = res.json()
      this.ctx.users[key] = { ...user, token }
    }
  }

  withAdmin = () => {
    this.shouldLoadAdmin = true
    return this
  }

  withCustomer = () => {
    this.shouldLoadCustomer = true
    return this
  }

  resetMocks = () => {
    this.ctx.mocks = { id: randomUUID() }
    return this
  }

  static closeApp = async () => {
    if (this.appInstance) {
      await this.appInstance.close()
      this.appInstance = null
    }
  }

  build = async (): Promise<TestContext> => {
    this.app = await TestContextBuilder.init()

    if (this.shouldLoadAdmin) {
      await this.loginUser('admin', {
        email: 'admin@example.com',
        password: 'admin123'
      })
    }

    if (this.shouldLoadCustomer) {
      await this.loginUser('customer', {
        email: 'customer@example.com',
        password: 'cust123'
      })
    }

    this.ctx.db = {
      getAllRecordsFrom: async <T extends Record<string, unknown>>(table: Table): Promise<T[]> => {
        return this.app.db.select().from(table).execute() as unknown as T[]
      },
      getOneRecordFrom: async <T extends Record<string, unknown>>(table: Table): Promise<T> => {
        return (await this.app.db.select().from(table).limit(1).execute())[0] as T
      }
    }

    return {
      app: this.app,
      users: this.ctx.users,
      mocks: this.ctx.mocks,
      db: this.ctx.db
    }
  }
}
