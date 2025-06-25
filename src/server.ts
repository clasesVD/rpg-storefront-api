import { buildApp } from './app'

const server = buildApp()

const start = async () => {
  try {
    await server.ready()
    await server.listen({ port: server.config.PORT })
  } catch (err) {
    server.log.error(err)
    process.exit(1)
  }
}

start()
