import { z } from 'zod'
import {
  CodeSchema,
  DescriptionSchema,
  NameSchema,
  makeHandle,
  refSchema,
  type Handle,
} from './core.ts'

// DHIS2 UserGroup. `members` is a Set<User> on the server; referencing users
// here by handle lets `identifier=CODE` preheat resolve them at import time.
export const UserGroupSchema = z.object({
  code: CodeSchema,
  name: NameSchema,
  description: DescriptionSchema.optional(),
  members: z.array(refSchema('User')).optional(),
})

export type UserGroupInput = z.infer<typeof UserGroupSchema>
export type UserGroup = Handle<'UserGroup', UserGroupInput>

export function defineUserGroup(input: z.input<typeof UserGroupSchema>): UserGroup {
  const parsed = UserGroupSchema.parse(input)
  return makeHandle('UserGroup', parsed)
}
