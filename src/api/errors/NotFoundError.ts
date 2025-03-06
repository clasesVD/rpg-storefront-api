import MinorError from './levels/MinorError'

class NotFoundError extends MinorError {
  constructor (message: string) {
    super(404, 'Not Found', message)
    this.type = 'NotFoundError'
  }
}

export default NotFoundError
