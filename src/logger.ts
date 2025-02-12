import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify'

const redactOptions = {
  paths: [
    'req.headers.authorization',
    'req.body.password',
    'req.body.token'
  ],
  censor: '*****'
}

const serializeRequest = (request: FastifyRequest) => ({
  method: request.method,
  url: request.url,
  headers: {
    'host': request.headers['host'],
    'content-type': request.headers['content-type']
  },
  body: process.env.LOG_LEVEL === 'debug' && request.body ? request.body : undefined
})

const serializeReply = (reply: FastifyReply) => ({
  statusCode: reply.statusCode
})

const serializeError = (error: FastifyError) => ({
  type: error.constructor.name,
  message: error.message,
  stack: error.stack
})

const loggerConfig = {
  transport: {
    level: process.env.LOG_LELVEL,
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname,responseTime',
      levelFirst: false,
      singleLine: true
    }
  },
  redact: redactOptions,
  serializers: {
    req: serializeRequest,
    res: serializeReply,
    err: serializeError
  }
}

export default loggerConfig
