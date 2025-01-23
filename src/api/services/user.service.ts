import { FastifyInstance } from 'fastify';
import { usersTable } from '../../db/schema';

class UserService {
    fastify: FastifyInstance

    constructor(fastify: FastifyInstance){
        this.fastify = fastify;
    }

    async get(){
        return this.fastify.db.select().from(usersTable).execute()
    }
}

export default UserService
