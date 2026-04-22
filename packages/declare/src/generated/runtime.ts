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

/**
 * Run `fn` with `target` active, then restore the previous value. Works
 * for both sync and async callbacks: if `fn` returns a thenable, the
 * previous target is restored when the promise settles rather than
 * synchronously, so `defineX()` calls after an `await` still see `target`.
 */
export function withTarget<T>(target: Target, fn: () => T): T {
  const prev = current
  current = target
  try {
    const result = fn()
    if (isThenable(result)) {
      return result.then(
        (value) => {
          current = prev
          return value
        },
        (err) => {
          current = prev
          throw err
        },
      ) as T
    }
    current = prev
    return result
  } catch (err) {
    current = prev
    throw err
  }
}

function isThenable<T>(value: T): value is T & PromiseLike<unknown> {
  return (
    value !== null &&
    (typeof value === "object" || typeof value === "function") &&
    typeof (value as { then?: unknown }).then === 'function'
  )
}
