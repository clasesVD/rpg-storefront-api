import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export default fp((fastify, options, done) => {
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
          url: `${fastify.config.HOST}:${fastify.config.PORT}`,
          description: `${fastify.config.NODE_ENV} server`
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
