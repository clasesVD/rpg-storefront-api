import Fastify, { type FastifyInstance, type RouteShorthandOptions } from 'fastify'
import type { Server, IncomingMessage, ServerResponse } from 'http'
import autoload from '@fastify/autoload'
import path from 'node:path'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import router from './api/router'

const server: FastifyInstance = Fastify({}).withTypeProvider<TypeBoxTypeProvider>()

server.register(autoload, {
  dir: path.join(__dirname, 'plugins')
})

server.register(router)

const start = async () => {
  try {
    await server.ready()
    await server.listen({ port: server.config.PORT })

    const address = server.server.address()
    const port = typeof address === 'string' ? address : address?.port

  } catch (err) {
    console.error(err)
    process.exit(1)
  }
}

start()
