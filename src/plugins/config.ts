import fp from 'fastify-plugin'
import fastifyEnv from '@fastify/env'
import  { Type as T, type Static } from '@sinclair/typebox'

export const configSchema = T.Object({
  HOST: T.String({ default: 'http://localhost' }),
  PORT: T.Number({ default: 3000 }),
  DATABASE_URL: T.String(),
  JWT_SECRET: T.String()
})

export type Config = Static<typeof configSchema>

declare module 'fastify' {
  interface FastifyInstance {
    config: Config
  }
}

export default fp((fastify, options, done) => {
  fastify.register(fastifyEnv, {
    dotenv: true,
    confKey: 'config',
    schema: configSchema,
    ...options
  })

  done()
})
