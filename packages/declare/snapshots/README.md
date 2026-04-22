# DHIS2 `/api/schemas.json` snapshots

Committed snapshots used as the input to `pnpm --filter @devotta-labs/declare gen:schemas`.

One file per supported DHIS2 stable target: `schemas-<target>.json`. The generator
reads these at build time; no network access is needed to regenerate
`packages/declare/src/generated/`.

## Refreshing

Use `declare-cli sync-schemas`:

```
pnpm --filter @devotta-labs/declare-cli exec declare-cli sync-schemas --target 2.42
```

It boots a throwaway DHIS2 stack on a free port, hits `/api/schemas.json` once
DHIS2 is ready, writes the response here, then tears the stack down.

Re-run `pnpm gen:schemas` after any snapshot refresh to keep the generated
code in sync.

## Target matrix (stable only)

| Target | Docker image             |
| ------ | ------------------------ |
| 2.40   | `dhis2/core:2.40.11`     |
| 2.41   | `dhis2/core:2.41.8`      |
| 2.42   | `dhis2/core:2.42.4`      |

2.43 is not yet GA on `dhis2/core`; it will be added once stable tags ship.
