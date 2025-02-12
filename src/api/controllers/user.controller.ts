import type { FastifyInstance } from 'fastify'
import UserService from '../services/user.service'
import type { UserCreateRequest, UserCreateResponse, UserGetByIdRequest, UserGetByIdResponse, UserPatchByIdRequest, UserPatchByIdResponse } from '../schemas/user.schema'

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

  async getById (req: UserGetByIdRequest, res: UserGetByIdResponse){
    return this.userService.getById(req.params.id)
  }

  async patchById (req: UserPatchByIdRequest, res: UserPatchByIdResponse){
    return this.userService.patchById(req.params.id, req.body)
  }
}

export default UserController
