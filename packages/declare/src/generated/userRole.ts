// AUTO-GENERATED — do not edit by hand.
//
// Source: packages/declare/snapshots/schemas-<target>.json
// Tool:   packages/declare/scripts/generate.ts
//
// Re-run `pnpm --filter @devotta-labs/declare gen:schemas` to refresh.

import { z } from 'zod'

export const UserRoleBase_2_40 = z.object({
  authorities: z.array(z.string()).optional(),
  code: z.string().max(50).optional(),
  description: z.string().max(255).optional(),
  name: z.string().max(230),
  restrictions: z.array(z.string()).optional(),
})

export const UserRoleBase_2_41 = z.object({
  authorities: z.array(z.string()).optional(),
  code: z.string().max(50).optional(),
  description: z.string().max(255).optional(),
  name: z.string().max(230),
  restrictions: z.array(z.string()).optional(),
})

export const UserRoleBase_2_42 = z.object({
  authorities: z.array(z.string()).optional(),
  code: z.string().max(50).optional(),
  description: z.string().max(255).optional(),
  name: z.string().max(230),
  restrictions: z.array(z.string()).optional(),
})

export const UserRoleBaseByTarget = {
  '2.40': UserRoleBase_2_40,
  '2.41': UserRoleBase_2_41,
  '2.42': UserRoleBase_2_42,
} as const
