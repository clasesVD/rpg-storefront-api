import BaseError from './BaseError'

class MinorError extends BaseError {
  constructor(code: number, title: string, message: string) {
    super(code, title, message, 'minor')
    this.type = 'MinorError'
  }
}

export default MinorError
