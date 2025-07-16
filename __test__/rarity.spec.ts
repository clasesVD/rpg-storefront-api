import type { Rarity } from '../src/api/schemas/rarity.schema'
import { rarityTable } from '../src/db'
import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'

let ctx: TestContext

describe('Rarities Routes', () => {
  beforeAll(async () => {
    ctx = await new TestContextBuilder()
      .withAdmin()
      .withCustomer()
      .build()
  })

  describe('/rarities/GET', () => {
    it('should return an array of rarities', async () => {
      const rarities: Rarity[] = await ctx.db.getAllRecordsFrom(rarityTable)

      const result = await ctx.app.inject({
        method: 'GET',
        url: '/rarities',
        headers: {
          authorization: `Bearer ${ctx.users.admin.token}`
        }
      })

      expect(result.json()).toEqual(rarities)
    })

    it('should thrown an error if the user is not admin', async () => {
      const result = await ctx.app.inject({
        method: 'GET',
        url: '/rarities',
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

    it('should thrown an error if the user is not authenticated', async () => {
      const result = await ctx.app.inject({
        method: 'GET',
        url: '/rarities'
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
