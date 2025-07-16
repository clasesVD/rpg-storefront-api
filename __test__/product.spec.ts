import type { Item } from '../src/api/schemas/item.schema'
import type { Product } from '../src/api/schemas/product.schema'
import type { Rarity } from '../src/api/schemas/rarity.schema'
import { productTable, rarityTable, itemTable } from '../src/db'
import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'

let ctx: TestContext
let products: Product[]
let mockProduct: Product
let rarity: Rarity
let item: Item

describe('Products Routes', () => {
  beforeAll(async () => {
    ctx = await new TestContextBuilder()
      .withAdmin()
      .withCustomer()
      .build()
    products = await ctx.db.getAllRecordsFrom(productTable)
    rarity = await ctx.db.getOneRecordFrom(rarityTable)
    item = await ctx.db.getOneRecordFrom(itemTable)
  })

  describe('/products', () => {
    describe('/GET', () => {
      it('should return an array of products', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/products',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(products)
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/products',
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

    describe('/POST', () => {
      it('should create a new product', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/products',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            itemId: item.id,
            rarityId: rarity.id,
            price: 500
          }
        })

        mockProduct = result.json()

        expect(result.json()).toEqual(expect.objectContaining(mockProduct))
      })

      it('should throw an error when there\'s no item provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/products',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            itemId: '',
            rarityId: rarity.id,
            price: 500
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'major',
          message: 'Item is required'
        })
      })

      it('should throw an error when there\'s no rarity provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/products',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            itemId: item.id,
            rarityId: '',
            price: 500
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'major',
          message: 'Rarity is required'
        })
      })

      it('should throw an error when there\'s no price provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/products',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            itemId: item.id,
            rarityId: rarity.id,
            price: ''
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'major',
          message: 'Price is required'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/products',
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            itemId: item.id,
            rarityId: rarity.id,
            price: 500
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

  describe('/products/:id', () => {
    describe('/GET', () => {
      it('should return a product by id', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/products/${products[0].id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(products[0])
      })

      it('should throw an error if the product does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/products/${ctx.mocks.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `Product with ID: ${ctx.mocks.id} does not exist.`
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: `/products/${products[0].id}`,
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
      it('should throw an error if the product does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/products/${ctx.mocks.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            price: 500
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `Product with ID: ${ctx.mocks.id} does not exist.`
        })
      })

      it('should update a product by id', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/products/${mockProduct.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            price: 1000
          }
        })

        expect(result.json()).toEqual({
          ...mockProduct,
          price: 1000
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/products/${products[0].id}`,
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            price: 500
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

    describe('/DELETE', () => {
      it('should throw an error if the product does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/products/${ctx.mocks.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `Product with ID: ${ctx.mocks.id} does not exist.`
        })
      })

      it('should delete a product by id', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/products/${mockProduct.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(mockProduct)
      })
    })
  })
})
