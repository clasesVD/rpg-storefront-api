import { buildApp } from '../src/app'

const app = buildApp()

describe('/health', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should return status healthy', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/health'
    })

    expect(response.json()).toEqual({ status: 'healthy' })
  })
})
