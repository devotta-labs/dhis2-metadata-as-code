# dhis2-metadata-as-code

Declare DHIS2 metadata (categories, data elements, org units, …) in TypeScript, validate it with Zod at load time, and push it to a DHIS2 instance via the `/api/metadata` endpoint.

## Requirements

- Node 22+
- pnpm 10+

## Setup

```bash
pnpm install

# Option A — target an existing DHIS2 instance (play / staging / prod):
cp .env.example .env   # fill in DHIS2_BASE_URL and DHIS2_TOKEN

# Option B — spin up a local empty DHIS2 in Docker (writes .env.local for you):
pnpm dhis2:up
```

`pnpm dhis2:up` boots `dhis2/core-dev:latest` + Postgres via
[`docker/docker-compose.yml`](./docker/docker-compose.yml), waits for DHIS2 to
finish its first-boot migrations, mints a Personal Access Token for the default
`admin` / `district` user, and writes `DHIS2_BASE_URL=http://localhost:8080`
and `DHIS2_TOKEN=<generated>` to `.env.local`. First cold boot takes several
minutes.

## Commands

| Script | What it does |
| --- | --- |
| `pnpm check` | Validate the schema locally (no network). |
| `pnpm plan` | Submit the schema to DHIS2 in dry-run mode. |
| `pnpm apply` | Submit the schema to DHIS2 and commit. |
| `pnpm typecheck` | `tsc --noEmit`. |
| `pnpm test` | Run the Vitest suite. |
| `pnpm dhis2:up` | Start local empty DHIS2 + auto-generate `.env.local`. |
| `pnpm dhis2:down` | Stop the local stack and wipe its DB volume. |
| `pnpm dhis2:logs` | Dump container logs into `logs/web.log` and `logs/db.log`. |

`pnpm dhis2:logs` accepts container IDs (handy for agents that want to target a
specific running container):

```bash
scripts/pull-logs.sh --web $(docker compose -f docker/docker-compose.yml ps -q web) \
                     --db  $(docker compose -f docker/docker-compose.yml ps -q db)
```

The schema entrypoint is [`src/metadata/schema.ts`](./src/metadata/schema.ts); the CLI entrypoint is [`src/cli/index.ts`](./src/cli/index.ts).

See [`UPSTREAM_BUGS.md`](./UPSTREAM_BUGS.md) for known DHIS2 master bugs worked around by this client.
