class BaseError extends Error {
  type: string
  code: number
  title: string
  level: string

  constructor (code: number, title: string, message: string, level: string){
    super(message)
    this.type = 'BaseError'
    this.code = code
    this.title = title
    this.level = level
  }

  toJSON () {
    return {
      ...this,
      message: this.message
    }
  }

  serialize () {
    return JSON.stringify(this.toJSON())
  }
}

export default BaseError
