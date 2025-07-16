import type { User } from '../src/api/schemas/user.schema'
import { userTable } from '../src/db'
import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'
import { eq } from 'drizzle-orm'

let ctx: TestContext
let users: User[]
let testUser: User

const testUserPayload = {
  name: 'John Max Doe',
  email: 'john-max@example.com',
  password: 'password123',
  role: 'C'
}

describe('Users Routes', () => {
  beforeAll(async () => {
    ctx = await new TestContextBuilder().withAdmin().withCustomer().build()

    const register = await ctx.app.inject({
      method: 'POST',
      url: '/auth/register',
      payload: testUserPayload
    })

    testUser = register.json()

    users = await ctx.db.getAllRecordsFrom(userTable)
  })

  afterAll(async () => {
    await ctx.app.db
      .delete(userTable)
      .where(eq(userTable.email, testUserPayload.email))
      .execute()
  })

  describe('/users', () => {
    describe('/GET', () => {
      it('should return an array of users', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/users',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(users.map(({ password, ...user }) => user))
      })
    })
  })

  describe('/users/:id', () => {
    describe('/GET', () => {
      it('should return a user by id', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/users/${testUser.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({ ...testUser, password: undefined, token: undefined })
      })

      it('should throw an error if the user does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/users/${ctx.mocks.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `User with ID:${ctx.mocks.id} does not exist.`
        })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/users/${testUser.id}`
        })

        expect(result.json()).toEqual({
          code: 401,
          title: 'Unauthorized',
          type: 'UnauthorizedError',
          level: 'minor',
          message: 'Invalid or missing token.'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/users/${testUser.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          }
        })

        expect(result.json()).toEqual({
          code: 403,
          title: 'Forbidden',
          type: 'ForbiddenError',
          level: 'minor',
          message: 'You are not allowed to perform this action.'
        })
      })
    })

    describe('/PATCH', () => {
      it('should update a user by id', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${testUser.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            name: 'Updated Name'
          }
        })

        expect(result.json()).toEqual({ ...testUser, name: 'Updated Name', password: undefined, token: undefined })

        testUser = { ...testUser, name: 'Updated Name' }
      })

      it('should throw an error if the user does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${ctx.mocks.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            name: 'Whatever'
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `User with ID:${ctx.mocks.id} does not exist.`
        })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${testUser.id}`,
          payload: {
            name: 'Another'
          }
        })

        expect(result.json()).toEqual({
          code: 401,
          title: 'Unauthorized',
          type: 'UnauthorizedError',
          level: 'minor',
          message: 'Invalid or missing token.'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${testUser.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            name: 'Another'
          }
        })

        expect(result.json()).toEqual({
          code: 403,
          title: 'Forbidden',
          type: 'ForbiddenError',
          level: 'minor',
          message: 'You are not allowed to perform this action.'
        })
      })

      it('should throw an error if the fields are invalid', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${testUser.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            bob: 'bob'
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'minor',
          message: 'Invalid fields on user update'
        })
      })
    })

    describe('/DELETE', () => {
      it('should throw an error if the user does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/users/${ctx.mocks.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `User with ID:${ctx.mocks.id} does not exist.`
        })
      })

      it('should delete a user by id', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/users/${testUser.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({ ...testUser, token: undefined })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/users/${ctx.users.customer.id}`
        })

        expect(result.json()).toEqual({
          code: 401,
          title: 'Unauthorized',
          type: 'UnauthorizedError',
          level: 'minor',
          message: 'Invalid or missing token.'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/users/${ctx.users.customer.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          }
        })

        expect(result.json()).toEqual({
          code: 403,
          title: 'Forbidden',
          type: 'ForbiddenError',
          level: 'minor',
          message: 'You are not allowed to perform this action.'
        })
      })
    })
  })
})
