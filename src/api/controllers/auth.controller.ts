import type { FastifyInstance } from 'fastify'
import UserService from '../services/user.service'
import type {
  AuthCreateRequest,
  AuthCreateResponse,
  AuthLoginRequest,
  AuthLoginResponse
} from '../schemas/auth.schema'

class AuthController {
  userService: UserService

  constructor(fastify: FastifyInstance) {
    this.userService = new UserService(fastify)
  }

  async register(req: AuthCreateRequest, res: AuthCreateResponse) {
    if (!req.body) {
      return res.code(400).send({ message: 'Complete all data request' })
    }
  }

  async login(req: AuthLoginRequest, res: AuthLoginResponse) {
    if (!req.body) {
      return res.code(400).send({ message: 'Email and password are required' })
    }
  }
}

export default AuthController
