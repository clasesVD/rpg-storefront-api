import { Type as T } from '@sinclair/typebox'

export enum ROLE {
  ADMIN = 'A',
  CUSTOMER = 'C'
}

export const roleEnum = T.Enum(ROLE, {
  description: 'User Role',
  examples: [ROLE.ADMIN, ROLE.CUSTOMER]
})
