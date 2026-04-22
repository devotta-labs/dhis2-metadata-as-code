// AUTO-GENERATED — do not edit by hand.
//
// Source: packages/declare/snapshots/schemas-<target>.json
// Tool:   packages/declare/scripts/generate.ts
//
// Re-run `pnpm --filter @devotta-labs/declare gen:schemas` to refresh.

import { z } from 'zod'

export const OrganisationUnitLevelBase_2_40 = z.object({
  code: z.string().max(50).optional(),
  level: z.number().int(),
  name: z.string().max(230),
  offlineLevels: z.number().int().optional(),
})

export const OrganisationUnitLevelBase_2_41 = z.object({
  code: z.string().max(50).optional(),
  level: z.number().int(),
  name: z.string().max(230),
  offlineLevels: z.number().int().optional(),
})

export const OrganisationUnitLevelBase_2_42 = z.object({
  code: z.string().max(50).optional(),
  level: z.number().int(),
  name: z.string().max(230),
  offlineLevels: z.number().int().optional(),
})

export const OrganisationUnitLevelBaseByTarget = {
  '2.40': OrganisationUnitLevelBase_2_40,
  '2.41': OrganisationUnitLevelBase_2_41,
  '2.42': OrganisationUnitLevelBase_2_42,
} as const
