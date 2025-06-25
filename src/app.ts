import Fastify, { type FastifyInstance } from 'fastify'
import autoload from '@fastify/autoload'
import path from 'node:path'
import router from './api/router'
import loggerConfig from './logger'
import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'

export const buildApp = () => {
  const app: FastifyInstance = Fastify({ logger: loggerConfig }).withTypeProvider<TypeBoxTypeProvider>()

  app.register(autoload, {
    dir: path.join(__dirname, 'plugins')
  })

  app.register(router)

  return app
}
