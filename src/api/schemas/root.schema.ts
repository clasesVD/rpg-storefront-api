import { Type as T } from '@sinclair/typebox'

export const rootSchema = {
  response: {
    200: T.Object({
      pong: T.String()
    })
  }
}
