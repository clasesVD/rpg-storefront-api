import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
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

  async create (draft: UserDraft){
    return this.fastify.db.insert(usersTable).values(draft).returning()
  }

  async getById (id: string){
    const result = await this.fastify.db.select().from(usersTable).where(eq(usersTable.id, id))
    return result[0]
  }
}

export default UserService
