import { User } from '../src/api/schemas/user.schema'
import { userTable } from '../src/db'
import { getAllFrom } from './utils/getSeeds'
import { setupContext } from './utils/setupContext'

let ctx: Awaited<ReturnType<typeof setupContext>>
let users: User[]

describe('Users Routes', () => {
  beforeAll(async () => {
    ctx = await setupContext()
    users = await getAllFrom(ctx.app, userTable)
  })

  afterAll(async () => {
    await ctx.close()
  })

  describe('/users', () => {
    describe('/GET', () => {
      it('should return an array of users', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/users',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
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
          url: `/users/${ctx.admin.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual({ ...ctx.admin, password: undefined })
      })

      it('should throw an error if the user does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/users/${ctx.idMock}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `User with ID:${ctx.idMock} does not exist.`
        })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/users/${ctx.customer.id}`
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
          url: `/users/${ctx.customer.id}`,
          headers: {
            authorization: `Bearer ${ctx.customerToken}`
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
          url: `/users/${ctx.admin.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: 'John Max Doe'
          }
        })

        expect(result.json()).toEqual({ ...ctx.admin, name: 'John Max Doe', password: undefined })
      })

      it('should throw an error if the user does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${ctx.idMock}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: 'John Max Doe'
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `User with ID:${ctx.idMock} does not exist.`
        })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/users/${ctx.customer.id}`,
          payload: {
            name: 'John Max Doe'
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
          url: `/users/${ctx.customer.id}`,
          headers: {
            authorization: `Bearer ${ctx.customerToken}`
          },
          payload: {
            name: 'John Max Doe'
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
          url: `/users/${ctx.admin.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            bob: 'bob is here'
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
          url: `/users/${ctx.idMock}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `User with ID:${ctx.idMock} does not exist.`
        })
      })

      it('should delete a user by id', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/users/${ctx.admin.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual({ ...ctx.admin, name: 'John Max Doe' })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/users/${ctx.customer.id}`
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
          url: `/users/${ctx.customer.id}`,
          headers: {
            authorization: `Bearer ${ctx.customerToken}`
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
