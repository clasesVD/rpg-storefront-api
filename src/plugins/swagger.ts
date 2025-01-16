import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

const swaggerOptions = {
  openapi: {
    openapi: '3.0.0',
    info: {
      title: 'RPG STOREFRONT API',
      description: 'The API documentation for RPG STOREFRONT',
      version: '0.0.1'
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server'
      }
    ],
    externalDocs: {
      url: 'https://swagger.io',
      description: 'Find more info here'
    }
  }
}

const swaggerUiOptions = {
  routePrefix: '/docs',
  staticCSP: true
}

export default fp((fastify, options, done) => {
  fastify.register(swagger, {
    ...swaggerOptions,
    ...options
  })

  fastify.register(swaggerUI, {
    ...swaggerUiOptions,
    ...options
  })

  done()
})
