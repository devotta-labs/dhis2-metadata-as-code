import { z } from 'zod'
import { isHandle, refSchema, stableUid } from './core.ts'

// DHIS2 access strings are 8 chars: r/w metadata at positions 0,1 and r/w
// data at positions 2,3; positions 4-7 are unused. See
// org.hisp.dhis.security.acl.AccessStringHelper.
//
// Examples:
//   "--------"  AccessStringHelper.DEFAULT  (no access)
//   "rw------"  read + write metadata
//   "r-rw----"  metadata read + data read/write
//   "rwrw----"  full metadata + data read/write
//   "--rw----"  data read/write only
export const AccessStringSchema = z
  .string()
  .regex(
    /^[r-][w-][r-][w-]----$/,
    'access string must be 8 chars of r/w/- with positions 4-7 all "-"',
  )

export const SharingSchema = z.object({
  publicAccess: AccessStringSchema.optional(),
  users: z
    .array(
      z.object({
        user: refSchema('User'),
        access: AccessStringSchema,
      }),
    )
    .optional(),
  userGroups: z
    .array(
      z.object({
        userGroup: refSchema('UserGroup'),
        access: AccessStringSchema,
      }),
    )
    .optional(),
})

export type SharingInput = z.infer<typeof SharingSchema>

// DHIS2's Sharing JSON shape (`public` key, not `publicAccess`, and maps
// keyed by uid — see org.hisp.dhis.user.sharing.Sharing).
export type SharingPayload = {
  public?: string
  owner: null
  users: Record<string, { id: string; access: string }>
  userGroups: Record<string, { id: string; access: string }>
}

export function toSharingPayload(sharing: SharingInput | undefined): SharingPayload | undefined {
  if (!sharing) return undefined
  const users: SharingPayload['users'] = {}
  for (const entry of sharing.users ?? []) {
    if (!isHandle(entry.user)) continue
    const id = stableUid(`${entry.user.kind}:${entry.user.code}`)
    users[id] = { id, access: entry.access }
  }
  const userGroups: SharingPayload['userGroups'] = {}
  for (const entry of sharing.userGroups ?? []) {
    if (!isHandle(entry.userGroup)) continue
    const id = stableUid(`${entry.userGroup.kind}:${entry.userGroup.code}`)
    userGroups[id] = { id, access: entry.access }
  }
  return {
    ...(sharing.publicAccess ? { public: sharing.publicAccess } : {}),
    owner: null,
    users,
    userGroups,
  }
}
