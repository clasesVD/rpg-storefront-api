import { Cart } from '../src/api/schemas/cart.schema'
import { Product } from '../src/api/schemas/product.schema'
import { setupContext } from './utils/setupContext'
import { getOneFrom } from './utils/getSeeds'
import { productTable } from '../src/db'

let ctx: Awaited<ReturnType<typeof setupContext>>
let cart: Cart
let product: Product

describe('Me Routes', () => {
  beforeAll(async () => {
    ctx = await setupContext()
    cart = (await ctx.app.inject({
      method: 'GET',
      url: `/carts/${ctx.admin.id}`,
      headers: {
        authorization: `Bearer ${ctx.adminToken}`
      }
    })).json()

    product = await getOneFrom(ctx.app, productTable)
  })

  afterAll(async () => {
    await ctx.close()
  })

  describe('/me', () => {
    describe('/GET', () => {
      it('should return the logged user', async () => {
        const result = await ctx.app.inject({
          method: 'GET',
          url: '/me',
          headers: {
            authorization: `Bearer ${ctx.adminToken}`
          }
        })

        expect(result.json()).toEqual({ user: ctx.admin, cart: {} })
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
            authorization: `Bearer ${ctx.adminToken}`
          },
          payload: {
            name: 'John Max Doe'
          }
        })

        expect(result.json()).toEqual({ ...ctx.admin, name: 'John Max Doe' })
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
            authorization: `Bearer ${ctx.adminToken}`
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
})
