import { type TestContext, TestContextBuilder } from './utils/TestContextBuilder'

let ctx: TestContext

beforeAll(async () => {
  ctx = await new TestContextBuilder().build()
})

describe('/health', () => {
  it('should return status healthy', async () => {
    const response = await ctx.app.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.json()).toEqual({ status: 'healthy' })
  })
})
