import { Rarity } from '../src/api/schemas/rarity.schema'
import { rarityTable } from '../src/db'
import { getAllFrom } from './utils/getSeeds'
import { setupContext } from './utils/setupContext'

let ctx: Awaited<ReturnType<typeof setupContext>>
let rarities: Rarity[]

describe('Rarities Routes', () => {
  beforeAll(async () => {
    ctx = await setupContext()
    rarities = await getAllFrom(ctx.app, rarityTable)
  })

  afterAll(async () => {
    await ctx.close()
  })

  describe('/rarities/GET', () => {
    it('should return an array of rarities', async () => {
      const result = await ctx.app.inject({
        method: 'GET',
        url: '/rarities',
        headers: {
          authorization: `Bearer ${ctx.adminToken}`
        }
      })

      expect(result.json()).toEqual(rarities)
    })

    it('should thrown an error if the user is not admin', async () => {
      const result = await ctx.app.inject({
        method: 'GET',
        url: '/rarities',
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
