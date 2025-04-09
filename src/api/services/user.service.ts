import type { FastifyInstance } from 'fastify'
import { eq } from 'drizzle-orm'
import { userTable } from '../../db'
import type { UserDraft, UserUpdate } from '../schemas/user.schema'
import { hashPassword } from '../../helpers/crypto'
import BadRequestError from '../errors/BadRequestError'
import NotFoundError from '../errors/NotFoundError'
import InternalServerError from '../errors/InternalServerError'

class UserService {
  fastify: FastifyInstance

  constructor(fastify: FastifyInstance) {
    this.fastify = fastify
  }

  async getAll() {
    return this.fastify.db.select().from(userTable).execute()
  }

  async create(draft: UserDraft) {
    try {
      const password = hashPassword(draft.password)
      const result = await this.fastify.db.insert(userTable).values({ ...draft, password }).returning()
      return result
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on user creation')

      if (e.message.includes('duplicate key value violates unique constraint'))
        throw new BadRequestError('There is already an account with the provided email')

      throw new InternalServerError('Failed to create user', e)
    }
  }

  async getById(id: string) {
    const result = await this.fastify.db.select().from(userTable).where(eq(userTable.id, id))

    if (!result[0]) throw new NotFoundError(`User with ID:${id} does not exist.`)
    return result[0]
  }

  async patchById(id: string, payload: UserUpdate) {
    await this.getById(id)
    try {
      const newData = { ...payload }

      if ('password' in newData) newData.password = hashPassword(newData.password)

      const result = await this.fastify.db.update(userTable).set(newData).where(eq(userTable.id, id)).returning()
      return result[0]
    } catch (e) {
      if (e.message.startsWith('syntax error'))
        throw new BadRequestError('Invalid fields on user update')

      throw new InternalServerError(`Failed to update user with ID:${id}`, e)
    }
  }

  async deleteById(id: string) {
    await this.getById(id)
    try {
      const result = await this.fastify.db.delete(userTable).where(eq(userTable.id, id)).returning()
      return result[0]
    } catch (e) {
      throw new InternalServerError(`Failed to delete user with ID:${id}`, e)
    }
  }

  async getByEmail(email: string) {
    try {
      const result = await this.fastify.db.select().from(userTable).where(eq(userTable.email, email))
      return result[0]
    } catch (e) {
      throw new InternalServerError('Failed to get user by email', e)
    }
  }
}

export default UserService
