import fp from 'fastify-plugin'
import BaseError from '../api/errors/levels/BaseError'
import FatalError from '../api/errors/levels/FatalError'

export default fp((fastify, options, done) => {
  fastify.setErrorHandler((error: BaseError | Error, req, res) => {
    const parsedError = error instanceof BaseError ? error : new FatalError('Unknown Error', error.message, error)

    const handleMinorError = () => {
      fastify.log.warn(parsedError.serialize())
      return res.code(parsedError.code).send(parsedError.toJSON())
    }

    const handleFatalError = () => {
      fastify.log.error(parsedError.serialize())
      res.code(parsedError.code).send(parsedError.toJSON())
      return parsedError
    }

    if (parsedError.level === 'minor') handleMinorError()
    else handleFatalError()
  })

  done()
})
