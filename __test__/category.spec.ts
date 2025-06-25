import { Category } from '../src/api/schemas/category.schema'
import { categoryTable } from '../src/db'
import { getAllFrom } from './utils/getSeeds'
import { setupContext } from './utils/setupContext'

let ctx: Awaited<ReturnType<typeof setupContext>>
let categories: Category[]
let mockCategory: Category

describe('Categories Routes', () => {
  beforeAll(async () => {
    ctx = await setupContext()
    categories = await getAllFrom(ctx.app, categoryTable)
  })

  afterAll(async () => {
    await ctx.close()
  })

  describe('/categories', () => {
    describe('/GET', () => {
      it('should return an array of categories', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/categories',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(categories)
      })
    })

    describe('/POST', () => {
      it('should create a new category', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/categories',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: 'Mock Category'
          }
        })

        mockCategory = result.json()

        expect(result.json()).toEqual(expect.objectContaining(mockCategory))
      })

      it('should throw an error when there\'s no name provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/categories',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: ''
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'major',
          message: 'Name is required'
        })
      })

      it('should throw an error if the category already exists', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/categories',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: categories[0].name
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'major',
          message: 'Category already exists'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/categories',
          headers: {
            authorization: `Bearer ${ctx.customerToken}`
          },
          payload: {
            name: 'Mock Category'
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

  describe('/categories/:id', () => {
    describe('/GET', () => {
      it('should return a category by id', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/categories/${categories[0].id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(categories[0])
      })
    })

    describe('/DELETE', () => {
      it('should delete a category by id', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/categories/${mockCategory.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(mockCategory)
      })
    })
  })
})
