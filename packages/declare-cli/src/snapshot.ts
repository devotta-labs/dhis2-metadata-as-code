import {
  composeStartService,
  composeStopService,
  execSqlOnDb,
  resolveDhis2Image,
  type StackEnv,
} from './docker.ts'

const APP_DB = 'dhis'
const PRISTINE_DB = 'dhis_pristine'
const COMMENT_PREFIX = 'declare-cli:image='

export type PristineStatus =
  | { kind: 'missing' }
  | { kind: 'stale'; recordedImage: string; currentImage: string }
  | { kind: 'fresh'; image: string }

function quote(sql: string): string {
  return sql.replace(/'/g, "''")
}

export async function pristineStatus(env: StackEnv): Promise<PristineStatus> {
  const currentImage = resolveDhis2Image(env)

  const existsOut = await execSqlOnDb(
    env,
    `SELECT 1 FROM pg_database WHERE datname = '${PRISTINE_DB}';`,
  )
  if (existsOut.trim() === '') return { kind: 'missing' }

  const commentOut = await execSqlOnDb(
    env,
    `SELECT pg_catalog.shobj_description(d.oid, 'pg_database') FROM pg_catalog.pg_database d WHERE d.datname = '${PRISTINE_DB}';`,
  )
  const comment = commentOut.trim()
  const recordedImage = comment.startsWith(COMMENT_PREFIX)
    ? comment.slice(COMMENT_PREFIX.length)
    : ''

  if (recordedImage !== currentImage) {
    return { kind: 'stale', recordedImage, currentImage }
  }
  return { kind: 'fresh', image: currentImage }
}

async function terminateConnections(env: StackEnv, database: string): Promise<void> {
  await execSqlOnDb(
    env,
    `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${quote(
      database,
    )}' AND pid <> pg_backend_pid();`,
  )
}

/**
 * Create the pristine snapshot from the current `dhis` database. Caller must
 * ensure the `web` container is stopped so no connections are held on `dhis`.
 */
export async function createPristineSnapshot(env: StackEnv): Promise<void> {
  const image = resolveDhis2Image(env)
  await terminateConnections(env, APP_DB)
  await execSqlOnDb(env, `DROP DATABASE IF EXISTS ${PRISTINE_DB};`)
  await execSqlOnDb(
    env,
    `CREATE DATABASE ${PRISTINE_DB} WITH TEMPLATE ${APP_DB} OWNER dhis;`,
  )
  await execSqlOnDb(
    env,
    `COMMENT ON DATABASE ${PRISTINE_DB} IS '${COMMENT_PREFIX}${quote(image)}';`,
  )
}

/**
 * Restore the `dhis` database from the pristine snapshot. Caller must ensure
 * the `web` container is stopped so no connections are held on `dhis`.
 */
export async function restoreFromPristine(env: StackEnv): Promise<void> {
  await terminateConnections(env, APP_DB)
  await execSqlOnDb(env, `DROP DATABASE IF EXISTS ${APP_DB};`)
  await execSqlOnDb(
    env,
    `CREATE DATABASE ${APP_DB} WITH TEMPLATE ${PRISTINE_DB} OWNER dhis;`,
  )
}

/**
 * Run `fn` with the `web` container stopped, then restart it. The DB container
 * is left running throughout.
 */
export async function withWebStopped<T>(env: StackEnv, fn: () => Promise<T>): Promise<T> {
  await composeStopService(env, 'web')
  try {
    return await fn()
  } finally {
    await composeStartService(env, 'web')
  }
}
