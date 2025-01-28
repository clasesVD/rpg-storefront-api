import type { FastifyInstance } from 'fastify'
import UserService from '../services/user.service'

class UserController {
  userService: UserService

  constructor (fastify: FastifyInstance){
    this.userService = new UserService(fastify)
  }

  async get (){
    return this.userService.get()
  }
}

export default UserController
