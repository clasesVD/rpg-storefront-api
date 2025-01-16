import { Type as T, Static } from '@sinclair/typebox'

export const rootSchema = T.Object({
  response: T.Object({
    200: T.Object({
      pong: T.String()
    })
  })
})

export type RootRoute = Static<typeof rootSchema>
