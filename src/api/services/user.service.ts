import type { FastifyInstance } from 'fastify'
import usersTable from '../../db/schema'
import type { UserDraft } from '../schemas/user.schema'

class UserService {
  fastify: FastifyInstance

  constructor (fastify: FastifyInstance){
    this.fastify = fastify
  }

  async getAll (){
    return this.fastify.db.select().from(usersTable).execute()
  }

  async create (userDraft: UserDraft){
    return this.fastify.db.insert(usersTable).values(userDraft).returning()
  }
}

export default UserService
