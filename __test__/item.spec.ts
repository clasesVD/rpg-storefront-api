import { Category } from '../src/api/schemas/category.schema'
import { Item } from '../src/api/schemas/item.schema'
import { categoryTable, itemTable } from '../src/db'
import { getAllFrom, getOneFrom} from './utils/getSeeds'
import { setupContext } from './utils/setupContext'

let ctx: Awaited<ReturnType<typeof setupContext>>
let itemMock: Item
let testCategory: Category
let items: Item[]
let item: Item

describe('Items Routes', () => {
  beforeAll(async () => {
    ctx = await setupContext()
    testCategory = await getOneFrom(ctx.app, categoryTable)
    items = await getAllFrom(ctx.app, itemTable)
    item = await getOneFrom(ctx.app, itemTable)
  })

  afterAll(async () => {
    await ctx.close()
  })

  describe('/items', () => {
    describe('/GET', () => {
      it('should return an array of items', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/items',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(items)
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/items',
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
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: 'Test Item',
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: [testCategory]
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
            authorization: `Bearer ${ctx.adminToken}`
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
            authorization: `Bearer ${ctx.customerToken}`
          },
          payload: {
            name: 'Test Item',
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: [testCategory]
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
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: null,
            description: 'This is a test item',
            image: 'https://example.com/test-item.jpg',
            categories: [testCategory]
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
          url: `/items/${item.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(item)
      })
    })

    describe('/DELETE', () => {
      it('should delete an item by id', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/items/${itemMock.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
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
