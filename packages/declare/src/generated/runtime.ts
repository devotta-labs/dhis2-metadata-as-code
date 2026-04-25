// AUTO-GENERATED — do not edit by hand.
//
// Source: packages/declare/snapshots/schemas-<target>.json
// Tool:   packages/declare/scripts/generate.ts
//
// Re-run `pnpm --filter @devotta-labs/declare gen:schemas` to refresh.

import { AsyncLocalStorage } from 'node:async_hooks'
import { DEFAULT_TARGET, type Target } from './targets.ts'
export type { Target } from './targets.ts'

// Process-wide fallback target. Library users who import defineX directly
// get DEFAULT_TARGET unless they call setTarget() or wrap their code in
// withTarget(). Async callers should prefer withTarget() so overlapping
// schema loads do not race through this fallback.
let current: Target = DEFAULT_TARGET
const targetStorage = new AsyncLocalStorage<Target>()

export function getTarget(): Target {
  return targetStorage.getStore() ?? current
}

export function setTarget(target: Target): void {
  current = target
}

/**
 * Run `fn` with `target` active for this async execution context.
 * Synchronous callbacks return synchronously; async callbacks keep the
 * target across awaits without changing the process-wide fallback.
 */
export function withTarget<T>(target: Target, fn: () => T): T {
  return targetStorage.run(target, fn)
}
