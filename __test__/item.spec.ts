import type { Category } from '../src/api/schemas/category.schema'
import type { Item } from '../src/api/schemas/item.schema'
import { categoryTable, itemTable } from '../src/db'
import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'

let ctx: TestContext
let itemMock: Item
let category: Category
let items: Item[]

describe('Items Routes', () => {
  beforeAll(async () => {
    ctx = await new TestContextBuilder()
      .withAdmin()
      .withCustomer()
      .build()
    category = await ctx.db.getOneRecordFrom(categoryTable)
    items = await ctx.db.getAllRecordsFrom(itemTable)
  })

  describe('/items', () => {
    describe('/GET', () => {
      it('should return an array of items', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/items',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(items)
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/items',
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

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/items'
        })

        expect(result.json()).toEqual({
          code: 401,
          title: 'Unauthorized',
          type: 'UnauthorizedError',
          level: 'minor',
          message: 'Invalid or missing token.'
        })
      })
    })

    describe('/POST', () => {
      it('should create a new item', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/items',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            name: 'Test Item',
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: [category]
          }
        })

        itemMock = result.json()

        expect(result.json()).toEqual(expect.objectContaining({
          name: 'Test Item',
          description: 'This is a test item',
          image: 'https://example.com/test-item.jpg',
          id: expect.any(String)
        }))
      })

      it('should throw an error when there\'s no category provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/items',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            name: 'Test Item',
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: []
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'minor',
          message: 'At least one category is required.'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/items',
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            name: 'Test Item',
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: [category]
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
          method: 'POST',
          url: '/items',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            name: null,
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: [category]
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'minor',
          message: 'Invalid fields on item creation.'
        })
      })
    })
  })

  describe('/items/:id', () => {
    describe('/GET', () => {
      it('should return an item by id', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/items/${items[0].id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(items[0])
      })
    })

    describe('/DELETE', () => {
      it('should delete an item by id', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/items/${itemMock.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({
          id: itemMock.id,
          name: itemMock.name,
          description: itemMock.description,
          image: itemMock.image,
          categories: []
        })
      })
    })
  })
})
