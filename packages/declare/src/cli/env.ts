import { existsSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { config as loadDotenv } from 'dotenv'

// Walk up from `start` looking for any of `names`; return absolute paths in
// priority order. First `.env.local` found wins over later `.env`s.
function findDotenvFiles(names: readonly string[], start: string = process.cwd()): string[] {
  const hits: string[] = []
  let dir = resolve(start)
  while (true) {
    for (const name of names) {
      const candidate = resolve(dir, name)
      if (existsSync(candidate)) hits.push(candidate)
    }
    const parent = dirname(dir)
    if (parent === dir) break
    dir = parent
  }
  return hits
}

export type Env = {
  baseUrl: string
  token: string
}

let dotenvLoaded = false

export function loadEnv(): Env {
  // `.env.local` wins over `.env`, and a file closer to cwd wins over one
  // higher up the tree. dotenv keeps the first definition it sees, so we pass
  // the most specific path first. Deferred until the first call so merely
  // importing `@devotta-labs/declare` doesn't scan the filesystem or mutate
  // `process.env`.
  if (!dotenvLoaded) {
    loadDotenv({ path: findDotenvFiles(['.env.local', '.env']), quiet: true })
    dotenvLoaded = true
  }
  const baseUrl = process.env.DHIS2_BASE_URL
  const token = process.env.DHIS2_TOKEN
  if (!baseUrl) throw new Error('DHIS2_BASE_URL is not set (check .env.local / .env or environment)')
  if (!token) throw new Error('DHIS2_TOKEN is not set (check .env.local / .env or environment)')
  return { baseUrl: baseUrl.replace(/\/+$/, ''), token }
}
