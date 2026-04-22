// AUTO-GENERATED — do not edit by hand.
//
// Source: packages/declare/snapshots/schemas-<target>.json
// Tool:   packages/declare/scripts/generate.ts
//
// Re-run `pnpm --filter @devotta-labs/declare gen:schemas` to refresh.

import { z } from 'zod'
import { refSchema } from '../lib/core.ts'
import { DataDimensionType_2_40, DataDimensionType_2_41, DataDimensionType_2_42 } from './enums.ts'

export const CategoryBase_2_40 = z.object({
  categoryOptions: z.array(refSchema('CategoryOption')).optional(),
  code: z.string().max(50).optional(),
  dataDimension: z.boolean(),
  dataDimensionType: DataDimensionType_2_40,
  description: z.string().optional(),
  name: z.string().max(230),
  shortName: z.string().max(50),
})

export const CategoryBase_2_41 = z.object({
  categoryOptions: z.array(refSchema('CategoryOption')).optional(),
  code: z.string().max(50).optional(),
  dataDimension: z.boolean(),
  dataDimensionType: DataDimensionType_2_41,
  description: z.string().optional(),
  name: z.string().max(230),
  shortName: z.string().max(50),
})

export const CategoryBase_2_42 = z.object({
  categoryOptions: z.array(refSchema('CategoryOption')).optional(),
  code: z.string().max(50).optional(),
  dataDimension: z.boolean(),
  dataDimensionType: DataDimensionType_2_42,
  description: z.string().optional(),
  name: z.string().max(230),
  shortName: z.string().max(50),
})

export const CategoryBaseByTarget = {
  '2.40': CategoryBase_2_40,
  '2.41': CategoryBase_2_41,
  '2.42': CategoryBase_2_42,
} as const
