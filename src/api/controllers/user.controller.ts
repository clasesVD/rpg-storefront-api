import type { FastifyInstance } from 'fastify'
import UserService from '../services/user.service'
import type { UserCreateRequest, UserCreateResponse } from '../schemas/user.schema'

class UserController {
  userService: UserService

  constructor (fastify: FastifyInstance){
    this.userService = new UserService(fastify)
  }

  async getAll (){
    return this.userService.getAll()
  }

  async create (req: UserCreateRequest, res: UserCreateResponse){
    const result = await this.userService.create(req.body)
    return result[0]
  }
}

export default UserController
