import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'
import type { Cart } from './../src/api/schemas/cart.schema'
import { cartTable, productTable } from '../src/db'
import type { Product } from '../src/api/schemas/product.schema'
import { eq } from 'drizzle-orm'

let ctx: TestContext
let adminCart: Cart
let customerCart: Cart
let product: Product

describe('Cart Routes', () => {
  beforeAll(async () => {
    ctx = await new TestContextBuilder()
      .withAdmin()
      .withCustomer()
      .build()

    await ctx.app.inject({
      method: 'POST',
      url: '/carts',
      headers: {
        authorization: `Bearer ${ctx.users.admin.token}`
      },
      payload: {
        userId: ctx.users.customer.id
      }
    })

    customerCart = (await ctx.app.inject({
      method: 'GET',
      url: `/carts/${ctx.users.customer.id}`,
      headers: {
        authorization: `Bearer ${ctx.users.customer.token}`
      }
    })).json()

    product = await ctx.db.getOneRecordFrom(productTable)
  })

  afterAll(async () => {
    await ctx.app.db
      .delete(cartTable)
      .where(eq(cartTable.id, adminCart.id))
      .execute()
  })

  describe('/carts', () => {
    describe('/POST', () => {
      it('should create a cart', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            userId: ctx.users.admin.id
          }
        })

        adminCart = result.json()

        expect(result.json()).toEqual(adminCart)
      })

      it('should throw an error when there\'s no user provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            userId: ''
          }
        })

        expect(result.json()).toEqual({
          code: 400,
          title: 'Bad Request',
          type: 'BadRequestError',
          level: 'minor',
          message: 'Invalid payload.'
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            userId: ctx.users.customer.id
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
          method: 'POST',
          url: '/carts',
          payload: {
            userId: ctx.users.customer.id
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
    })

    describe('/GET', () => {
      it('should return an array of carts', async () => {
        const carts = await ctx.db.getAllRecordsFrom(cartTable)
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(carts)
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/carts',
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
          url: '/carts'
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
  })

  describe('/carts/:id', () => {
    describe('/DELETE', () => {
      it('should delete a cart', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/carts/${customerCart.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual(customerCart)
      })
    })
  })

  describe('/carts/:cartId/products', () => {
    describe('/POST', () => {
      it('should add a product to a cart', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: `/carts/${adminCart.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            productId: product.id,
            quantity: 1
          }
        })

        expect(result.json()).toEqual({
          ...adminCart,
          products: [
            {
              productId: product.id,
              quantity: 1
            }
          ]
        })
      })

      it('should throw an error if the cart does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: `/carts/${ctx.mocks.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            productId: product.id,
            quantity: 1
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `Cart with ID: ${ctx.mocks.id} does not exist.`
        })
      })

      it('should throw an error if the product does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: `/carts/${adminCart.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            productId: ctx.mocks.id,
            quantity: 1
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
          method: 'POST',
          url: `/carts/${customerCart.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            productId: product.id,
            quantity: 1
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
          method: 'POST',
          url: `/carts/${customerCart.id}/products`,
          payload: {
            productId: product.id,
            quantity: 1
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
    })
  })

  describe('/carts/:cartId/products/:productId', () => {
    describe('/PATCH', () => {
      it('should throw an error if the cart does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/carts/${ctx.mocks.id}/products/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            quantity: 1
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `Cart with ID: ${ctx.mocks.id} does not exist.`
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/carts/${customerCart.id}/products/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.customer.token}`
          },
          payload: {
            quantity: 1
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
          method: 'PATCH',
          url: `/carts/${customerCart.id}/products/${product.id}`,
          payload: {
            quantity: 1
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

      it('should update a cart', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/carts/${adminCart.id}/products/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            quantity: 10
          }
        })

        expect(result.json()).toEqual({
          ...adminCart,
          products: [
            {
              productId: product.id,
              quantity: 10
            }
          ]
        })
      })
    })

    describe('/DELETE', () => {
      it('should remove a product from a cart', async () => {
        const result = await ctx.app.inject({
          method: 'DELETE',
          url: `/carts/${adminCart.id}/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({
          ...adminCart,
          products: []
        })
      })
    })
  })
})
