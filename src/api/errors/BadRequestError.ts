import MinorError from './levels/MinorError'

class BadRequestError extends MinorError {
  constructor (message: string) {
    super(400, 'Bad Request', message)
    this.type = 'BadRequestError'
  }
}

export default BadRequestError
