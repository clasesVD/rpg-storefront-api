import type { FastifyInstance } from 'fastify'
import UserService from '../services/user.service'
import type {
  UserCreateRequest,
  UserParamsRequest,
  UserPatchByIdRequest,
  UserPatchMeRequest,
  UserGetMeRequest,
  UserChangePasswordRequest
} from '../schemas/user.schema'
import { verifyPassword } from '../../helpers/crypto'
import BadRequestError from '../errors/BadRequestError'

class UserController {
  userService: UserService

  constructor(fastify: FastifyInstance) {
    this.userService = new UserService(fastify)
  }

  async getAll() {
    return this.userService.getAll()
  }

  async create(req: UserCreateRequest) {
    const result = await this.userService.create(req.body)
    return result[0]
  }

  async getById(req: UserParamsRequest) {
    return this.userService.getById(req.params.id)
  }

  async patchById(req: UserPatchByIdRequest) {
    return this.userService.patchById(req.params.id, req.body)
  }

  async deleteById(req: UserParamsRequest) {
    return this.userService.deleteById(req.params.id)
  }

  async getMe(req: UserGetMeRequest) {
    const userId = req.user.sub
    const user = await this.userService.getById(userId)
    //const activeCart = await this.cartService.getById(userId)
    //const orders = await this.orderService.getById(userId)

    return {
      user//,
      //activeCart,
      //orders
    }
  }

  async patchMe(req: UserPatchMeRequest) {
    const userId = req.user.sub
    const updated = await this.userService.patchById(userId, req.body)
    return updated
  }

  async changePassword(req: UserChangePasswordRequest) {
    const userId = req.user.sub
    const { oldPassword, newPassword } = req.body
    const user = await this.userService.getById(userId)
    const isValidPassword = verifyPassword(oldPassword, user.password)

    if (!isValidPassword) throw new BadRequestError('Invalid password')
    await this.userService.patchById(userId, { password: newPassword })
    return { message: 'Password changed successfully' }
  }
}

export default UserController
