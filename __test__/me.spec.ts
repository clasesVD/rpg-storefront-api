import type { Cart } from '../src/api/schemas/cart.schema'
import type { Product } from '../src/api/schemas/product.schema'
import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'
import { productTable } from '../src/db'

let ctx: TestContext
let cart: Cart
let product: Product

describe('Me Routes', () => {
  beforeAll(async () => {
    ctx = await new TestContextBuilder()
      .withAdmin()
      .withCustomer()
      .build()
    cart = (await ctx.app.inject({
      method: 'GET',
      url: `/carts/${ctx.users.admin.id}`,
      headers: {
        authorization: `Bearer ${ctx.users.admin.token}`
      }
    })).json()

    product = await ctx.db.getOneRecordFrom(productTable)
  })

  describe('/me', () => {
    describe('/GET', () => {
      it('should return the logged user', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/me',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          }
        })

        expect(result.json()).toEqual({ user: { ...ctx.users.admin, token: undefined }, cart: {} })
      })

      it('should throw an error if the user is not authenticated', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/me'
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

    describe('/PATCH', () => {
      it('should update the logged user', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: '/me',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            name: 'John Max Doe'
          }
        })

        expect(result.json()).toEqual({ ...ctx.users.admin, name: 'John Max Doe', token: undefined })
      })
    })
  })

  describe('/me/carts', () => {
    describe('/POST', () => {
      it('should add a product to a cart', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/me/cart',
          headers: {
            authorization: `Bearer ${ctx.users.admin.token}`
          },
          payload: {
            productId: product.id,
            quantity: 1
          }
        })

        console.log(result.json())

        // expect(result.json()).toEqual({
        //   ...cart,
        //   products: [
        //     {
        //       productId: product.id,
        //       quantity: 1
        //     }
        //   ]
        // })
      })
    })
  })

  // Still not finished, just moved on the corresponding tests
  // describe('/carts/:userId', () => {
  //   describe('/GET', () => {
  //     it('should return a cart', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         headers: {
  //           authorization: `Bearer ${ctx.users.admin.token}`
  //         },
  //         payload: {
  //           userId: ctx.users.admin.id
  //         }
  //       })

  //       expect(result.json()).toEqual(adminCart)
  //     })

  //     it('should throw an error if the user does not exist', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         headers: {
  //           authorization: `Bearer ${ctx.users.admin.token}`
  //         },
  //         payload: {
  //           userId: ctx.mocks.id
  //         }
  //       })

  //       expect(result.json()).toEqual({
  //         code: 404,
  //         title: 'Not Found',
  //         type: 'NotFoundError',
  //         level: 'minor',
  //         message: `Cart with ID: ${ctx.mocks.id} does not exist.`
  //       })
  //     })

  //     it('should throw an error if the user is not admin', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         headers: {
  //           authorization: `Bearer ${ctx.users.customer.token}`
  //         },
  //         payload: {
  //           userId: ctx.users.customer.id
  //         }
  //       })

  //       expect(result.json()).toEqual({
  //         code: 403,
  //         title: 'Forbidden',
  //         type: 'ForbiddenError',
  //         level: 'minor',
  //         message: 'You are not allowed to perform this action.'
  //       })
  //     })

  //     it('should throw an error if the user is not authenticated', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         payload: {
  //           userId: ctx.users.customer.id
  //         }
  //       })

  //       expect(result.json()).toEqual({
  //         code: 401,
  //         title: 'Unauthorized',
  //         type: 'UnauthorizedError',
  //         level: 'minor',
  //         message: 'Invalid or missing token.'
  //       })
  //     })
  //   })

  //   describe('/DELETE', () => {
  //     it('should delete a cart', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'DELETE',
  //         url: `/carts/${ctx.users.admin.id}`,
  //         headers: {
  //           authorization: `Bearer ${ctx.users.admin.token}`
  //         }
  //       })

  //       expect(result.json()).toEqual(adminCart)
  //     })

  //     it('should throw an error if the user does not exist', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'DELETE',
  //         url: `/carts/${ctx.mocks.id}`,
  //         headers: {
  //           authorization: `Bearer ${ctx.users.admin.token}`
  //         }
  //       })

  //       expect(result.json()).toEqual({
  //         code: 500,
  //         title: 'Internal Server Error',
  //         type: 'InternalServerError',
  //         level: 'fatal',
  //         message: `Failed to delete cart for user with ID: ${ctx.mocks.id}.`
  //       })
  //     })
  //   })
  // })
})
