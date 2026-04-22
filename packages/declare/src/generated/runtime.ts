// AUTO-GENERATED — do not edit by hand.
//
// Source: packages/declare/snapshots/schemas-<target>.json
// Tool:   packages/declare/scripts/generate.ts
//
// Re-run `pnpm --filter @devotta-labs/declare gen:schemas` to refresh.

import { DEFAULT_TARGET, type Target } from './targets.ts'
export type { Target } from './targets.ts'

// Mutable module-level setting; declare-cli sets this before loading
// the user schema so defineX() can pick the right Zod validator. Library
// users who import defineX directly get DEFAULT_TARGET unless they call
// setTarget() or wrap their code in withTarget().
let current: Target = DEFAULT_TARGET

export function getTarget(): Target {
  return current
}

export function setTarget(target: Target): void {
  current = target
}

/** Run `fn` with `target` active, then restore the previous value. */
export function withTarget<T>(target: Target, fn: () => T): T {
  const prev = current
  current = target
  try {
    return fn()
  } finally {
    current = prev
  }
}
