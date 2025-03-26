import fp from 'fastify-plugin'
import swagger from '@fastify/swagger'
import swaggerUI from '@fastify/swagger-ui'

export default fp((fastify, options, done) => {
  fastify.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: 'RPG STOREFRONT API',
        description: 'The API documentation for RPG STOREFRONT',
        version: '0.0.1'
      },
      components: {
        securitySchemes: {
          BearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
          }
        }
      },
      security: [{ BearerAuth: [] }],
      servers: [
        {
          url: `${fastify.config.HOST}:${fastify.config.PORT}`,
          description: `${fastify.config.NODE_ENV} server`
        }
      ],
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      ...options
    }
  })

  fastify.register(swaggerUI, {
    routePrefix: '/docs',
    staticCSP: true
  })

  done()
})
