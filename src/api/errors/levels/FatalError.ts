import BaseError from './BaseError'

class FatalError extends BaseError {
  cause?: Error

  constructor(title: string, message: string, cause?: Error) {
    super(500, title, message, 'fatal')
    this.type = 'FatalError',
    this.cause = cause
  }

  toJSON() {
    return {
      ...super.toJSON(),
      cause: JSON.stringify(this.cause, Object.getOwnPropertyNames(this.cause))
    }
  }
}

export default FatalError
