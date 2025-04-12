import type { FastifyInstance } from 'fastify'
import UserService from '../services/user.service'
import type {
  AuthRegisterRequest,
  AuthLoginRequest,
  JWTPayload
} from '../schemas/auth.schema'
import { verifyPassword } from '../../helpers/crypto'
import BadRequestError from '../errors/BadRequestError'

class AuthController {
  userService: UserService
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.userService = new UserService(fastify)
    this.fastify = fastify
  }

  async register(req: AuthRegisterRequest) {
    const result = await this.userService.create(req.body)
    return result[0]
  }

  async login(req: AuthLoginRequest) {
    const { password, ...user } = await this.userService.getByEmail(req.body.email)
    const isValidPassword = verifyPassword(req.body.password, password)

    if (!isValidPassword) throw new BadRequestError('Invalid email or password')

    const token = this.fastify.jwt.sign({
      iss: 'rpg-storefront',
      sub: user.id,
      iat: Date.now(),
      exp: 10800000 + (Date.now()),
      role: user.role
    } as JWTPayload)

    const response = { token, user }
    return response
  }
}

export default AuthController
