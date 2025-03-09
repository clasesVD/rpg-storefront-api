import FatalError from './levels/FatalError'

class InternalServerError extends FatalError {
  constructor(message: string, error: Error) {
    super('Internal Server Error', message, error)
    this.type = 'InternalServerError'
  }
}

export default InternalServerError
