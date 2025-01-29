import { FastifyInstance } from 'fastify';
import UserService from '../services/user.service';

class AuthController {
    userService: UserService

    constructor(fastify: FastifyInstance){
        this.userService = new UserService(fastify);
    }

    async register() {
        //llamar a userCreate
    }
}


export default AuthController
