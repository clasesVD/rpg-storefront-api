import MinorError from './levels/MinorError'

class UnauthorizedError extends MinorError {
  constructor(message: string) {
    super(401, 'Unauthorized', message)
    this.type = 'UnauthorizedError'
  }
}

export default UnauthorizedError
