import MinorError from './levels/MinorError'

class ForbiddenError extends MinorError {
  constructor(message: string) {
    super(403, 'Forbidden', message)
    this.type = 'ForbiddenError'
  }
}

export default ForbiddenError
