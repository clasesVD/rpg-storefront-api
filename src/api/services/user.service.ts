import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { usersTable } from '../../db/schema'
import type { UserDraft, UserUpdate } from '../schemas/user.schema'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class UserService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll () {
    const result = await this.fastify.db.select().from(usersTable).execute()
    return result
  }

  async create (draft: UserDraft) {
    try {
      const result = await this.fastify.db.insert(usersTable).values(draft).returning()
      return result
    }  catch(e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on user creation')

      throw new InternalServerError('Failed to create user', e)
    }
  }

  async getById(id: string) {
    const result = await this.fastify.db.select().from(usersTable).where(eq(usersTable.id, id))
    if (!result[0]) throw new NotFoundError(`User with ID:${id} does not exist.`)
    return result[0]
  }

  async patchById (id: string, payload: UserUpdate) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.update(usersTable).set(payload).where(eq(usersTable.id, id)).returning()
      return result[0]
    } catch(e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on user update')

      throw new InternalServerError(`Failed to update user with ID:${id}`, e)
    }
  }

  async deleteById (id: string) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.delete(usersTable).where(eq(usersTable.id, id)).returning()
      return result[0]
    } catch(e) {
      throw new InternalServerError(`Failed to delete user with ID:${id}`, e)
    }
  }
}

export default UserService
