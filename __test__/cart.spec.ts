import { Cart } from './../src/api/schemas/cart.schema'
import { cartTable, rarityTable, productTable } from '../src/db'
import { getAllFrom, getOneFrom } from './utils/getSeeds'
import { setupContext } from './utils/setupContext'
import { Product } from '../src/api/schemas/product.schema'

let ctx: Awaited<ReturnType<typeof setupContext>>
let carts: Cart[]
let mockCart: Cart
let customerCart: Cart
let product: Product

describe('Cart Routes', () => {
  beforeAll(async () => {
    ctx = await setupContext()
    carts = await getAllFrom(ctx.app, cartTable)
    await ctx.app.inject({
      method: 'POST',
      url: '/carts',
      headers: {
        authorization: `Bearer ${ctx.adminToken}`
      },
      payload: {
        userId: ctx.customer.id
      }
    })
    customerCart = (await ctx.app.inject({
      method: 'GET',
      url: `/carts/${ctx.customer.id}`,
      headers: {
        authorization: `Bearer ${ctx.customerToken}`
      }
    })).json()
    product = await getOneFrom(ctx.app, productTable)
  })

  afterAll(async () => {
    await ctx.close()
  })

  describe('/carts', () => {
    describe('/POST', () => {
      it('should create a cart', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            userId: ctx.admin.id
          }
        })

        mockCart = result.json()

        expect(result.json()).toEqual(mockCart)
      })

      it('should throw an error when there\'s no user provided', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
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
            authorization: `Bearer ${ctx.customerToken}`
          },
          payload: {
            userId: ctx.customer.id
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
            userId: ctx.customer.id
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
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/carts',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(carts)
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/carts',
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
          url: `/carts/${mockCart.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual(mockCart)
      })
    })
  })

  describe('/carts/:cartId/products', () => {
    describe('/POST', () => {
      it('should add a product to a cart', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: `/carts/${mockCart.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            productId: product.id,
            quantity: 1
          }
        })

        expect(result.json()).toEqual({
          ...mockCart,
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
          url: `/carts/${ctx.idMock}/products`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
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
          message: `Cart with ID: ${ctx.idMock} does not exist.`
        })
      })

      it('should throw an error if the product does not exist', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: `/carts/${mockCart.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            productId: ctx.idMock,
            quantity: 1
          }
        })

        expect(result.json()).toEqual({
          code: 404,
          title: 'Not Found',
          type: 'NotFoundError',
          level: 'minor',
          message: `Product with ID: ${ctx.idMock} does not exist.`
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'POST',
          url: `/carts/${customerCart.id}/products`,
          headers: {
            authorization: `Bearer ${ctx.customerToken}`
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
          url: `/carts/${ctx.idMock}/products/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
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
          message: `Cart with ID: ${ctx.idMock} does not exist.`
        })
      })

      it('should throw an error if the user is not admin', async () => {
        const result = await ctx.app.inject({
          method: 'PATCH',
          url: `/carts/${customerCart.id}/products/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.customerToken}`
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
          url: `/carts/${mockCart.id}/products/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            quantity: 10
          }
        })

        expect(result.json()).toEqual({
          ...mockCart,
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
          url: `/carts/${mockCart.id}/${product.id}`,
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual({
          ...mockCart,
          products: []
        })
      })
    })
  })

  // This should be in /ME spec
  // describe('/carts/:userId', () => {
  //   describe('/GET', () => {
  //     it('should return a cart', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         headers: {
  //           authorization: `Bearer ${ctx.adminToken}`
  //         },
  //         payload: {
  //           userId: ctx.admin.id
  //         }
  //       })

  //       expect(result.json()).toEqual(mockCart)
  //     })

  //     it('should throw an error if the user does not exist', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         headers: {
  //           authorization: `Bearer ${ctx.adminToken}`
  //         },
  //         payload: {
  //           userId: ctx.idMock
  //         }
  //       })

  //       expect(result.json()).toEqual({
  //         code: 404,
  //         title: 'Not Found',
  //         type: 'NotFoundError',
  //         level: 'minor',
  //         message: `Cart with ID: ${ctx.idMock} does not exist.`
  //       })
  //     })

  //     it('should throw an error if the user is not admin', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'GET',
  //         url: '/carts',
  //         headers: {
  //           authorization: `Bearer ${ctx.customerToken}`
  //         },
  //         payload: {
  //           userId: ctx.customer.id
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
  //           userId: ctx.customer.id
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
  //         url: `/carts/${ctx.admin.id}`,
  //         headers: {
  //           authorization: `Bearer ${ctx.adminToken}`
  //         }
  //       })

  //       expect(result.json()).toEqual(mockCart)
  //     })

  //     it('should throw an error if the user does not exist', async () => {
  //       const result = await ctx.app.inject({
  //         method: 'DELETE',
  //         url: `/carts/${ctx.idMock}`,
  //         headers: {
  //           authorization: `Bearer ${ctx.adminToken}`
  //         }
  //       })

  //       expect(result.json()).toEqual({
  //         code: 500,
  //         title: 'Internal Server Error',
  //         type: 'InternalServerError',
  //         level: 'fatal',
  //         message: `Failed to delete cart for user with ID: ${ctx.idMock}.`
  //       })
  //     })
  //   })
  // })
})
