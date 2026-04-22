// AUTO-GENERATED — do not edit by hand.
//
// Source: packages/declare/snapshots/schemas-<target>.json
// Tool:   packages/declare/scripts/generate.ts
//
// Re-run `pnpm --filter @devotta-labs/declare gen:schemas` to refresh.

import { z } from 'zod'

export const UserGroupBase_2_40 = z.object({
  code: z.string().max(50).optional(),
  name: z.string().max(230),
})

export const UserGroupBase_2_41 = z.object({
  code: z.string().max(50).optional(),
  name: z.string().max(230),
})

export const UserGroupBase_2_42 = z.object({
  code: z.string().max(50).optional(),
  description: z.string().max(255).optional(),
  name: z.string().max(230),
})

export const UserGroupBaseByTarget = {
  '2.40': UserGroupBase_2_40,
  '2.41': UserGroupBase_2_41,
  '2.42': UserGroupBase_2_42,
} as const
