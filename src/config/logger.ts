import type { FastifyRequest, FastifyReply, FastifyError } from 'fastify'

const logLevel = process.env.NODE_ENV === 'development' ? 'debug' : 'info'

const redactOptions = {
  paths: [
    'req.headers.authorization',
    'req.body.password',
    'req.body.token'
  ],
  censor: '*****'
}

const serializeRequest = (request: FastifyRequest): {
  method: string,
  url: string,
  headers: {
    'host': string | undefined;
    'content-type': string | undefined;
  },
  body: unknown
} => {
  return {
    method: request.method,
    url: request.url,
    headers: {
      'host': request.headers['host'],
      'content-type': request.headers['content-type']
    },
    body: process.env.NODE_ENV === 'development' && request.body ? request.body : undefined
  }
}

const serializeReply = (reply: FastifyReply): { statusCode: number } => {
  return {
    statusCode: reply.statusCode
  }
}

const serializeError = (error: FastifyError): { type: string, message: string, stack: string } => {
  return {
    type: error.constructor.name,
    message: error.message,
    stack: error.stack
  }
}

const loggerConfig = {
  transport: {
    level: logLevel,
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      levelFirst: false,
      singleLine: false
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
