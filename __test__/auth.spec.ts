import { JWTPayload } from '../src/api/schemas/auth.schema'
import { buildApp } from '../src/app'
import { userTable } from '../src/db'

const app = buildApp()

const payload = {
  name: 'John Doe',
  email: 'john@example.com',
  password: '123456',
  role: 'A'
}

describe('Auth Routes', () => {
  beforeAll(async () => {
    await app.ready()
    await (app as any).db.delete(userTable).execute()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/register', () => {
    it('should register a user correctly', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload
      })

      const { name, email, role, id, balance } = result.json()

      const expected = { ...payload, password: undefined, balance: '0.00', id: true }

      expect({
        name,
        email,
        role,
        balance,
        id: typeof id === 'string' && /^[0-9a-fA-F-]{36}$/.test(id)
      }).toEqual(expected)
    })

    it('should not register a user with the same email', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload
      })

      const expected = response.json()

      expect(expected).toEqual({
        code: 400,
        title: 'Bad Request',
        type: 'BadRequestError',
        level: 'minor',
        message: 'There is already an account with the provided email'
      })
    })

    it('should throw an error if the fields are invalid', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/auth/register',
        payload: {
          name: 'bob',
          email: 'bobmail@example.com',
          password: 'bobpass',
          role: 'C',
        }
      })

      expect(result.json()).toEqual({
        code: 400,
        title: 'Bad Request',
        type: 'BadRequestError',
        level: 'minor',
        message: 'Invalid fields on user creation'
      })
    })
  })

  describe('/login', () => {
    it('should login a user correctly', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload
      })

      const { token, user } = response.json()

      const decoded: JWTPayload = (app as any).jwt.verify(token)

      expect({
        token: typeof token === 'string' && typeof decoded === 'object' && decoded.sub === user.id,
        user: {
          name: user.name,
          email: user.email,
          role: user.role,
          balance: user.balance,
          id: typeof user.id === 'string' && /^[0-9a-fA-F-]{36}$/.test(user.id)
        }
      }).toEqual({
        token: true,
        user: {
          name: payload.name,
          email: payload.email,
          role: payload.role,
          balance: '0.00',
          id: true
        }
      })
    })

    it('should throw an error if the email is incorrect', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { ...payload, email: 'invalidemail@example.com' }
      })

      expect(result.json()).toEqual({
        code: 400,
        title: 'Bad Request',
        type: 'BadRequestError',
        level: 'minor',
        message: 'Invalid email or password'
      })
    })

    it('should throw an error if the password is incorrect', async () => {
      const result = await app.inject({
        method: 'POST',
        url: '/auth/login',
        payload: { ...payload, password: 'wrongpassword' }
      })

      expect(result.json()).toEqual({
        code: 400,
        title: 'Bad Request',
        type: 'BadRequestError',
        level: 'minor',
        message: 'Invalid email or password'
      })
    })
  })
})
