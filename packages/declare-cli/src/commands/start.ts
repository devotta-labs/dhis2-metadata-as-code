import { spinner } from '@clack/prompts'
import type { LoadedConfig } from '../config-loader.ts'
import {
  assertDockerAvailable,
  composeUp,
  isPortFree,
  type StackEnv,
  waitUntilReady,
  webContainerState,
} from '../docker.ts'
import { createPristineSnapshot, pristineStatus, withWebStopped } from '../snapshot.ts'
import { ui, pc } from '../ui.ts'
import { applyLoaded } from './apply.ts'

export function stackEnvFor(loaded: LoadedConfig): StackEnv {
  return {
    project: loaded.config.name,
    webPort: loaded.config.local.port,
  }
}

export function baseUrlFor(loaded: LoadedConfig): string {
  return `http://localhost:${loaded.config.local.port}`
}

async function ensurePristineSnapshot(env: StackEnv, baseUrl: string): Promise<void> {
  const status = await pristineStatus(env)

  if (status.kind === 'fresh') return

  const s = spinner()
  if (status.kind === 'missing') {
    s.start('Capturing pristine DB snapshot')
  } else {
    s.start(
      `Refreshing pristine DB snapshot (image changed: ${status.recordedImage || '(unset)'} → ${status.currentImage})`,
    )
  }
  try {
    await withWebStopped(env, () => createPristineSnapshot(env))
    // web was just restarted; wait for it to come back before handing off to apply
    await waitUntilReady(baseUrl)
  } catch (err) {
    s.stop('Snapshot capture failed', 1)
    throw err
  }
  s.stop('Pristine snapshot ready')
}

export async function start(loaded: LoadedConfig, _args: readonly string[]): Promise<void> {
  const env = stackEnvFor(loaded)
  const baseUrl = baseUrlFor(loaded)

  await assertDockerAvailable()

  const state = await webContainerState(env)
  const alreadyRunning = state === 'running'

  if (!alreadyRunning) {
    const portFree = await isPortFree(env.webPort)
    if (!portFree) {
      throw new Error(
        `Port ${env.webPort} is already in use on 127.0.0.1, and it's not this project's DHIS2.\n` +
          `Change \`local.port\` in declare.config.ts, or free the port.`,
      )
    }
  }

  const s = spinner()

  if (alreadyRunning) {
    ui.info(`Stack ${pc.cyan(env.project)} already running.`)
  } else {
    s.start('Initializing Docker')
    try {
      await composeUp(env, { quiet: true })
    } catch (err) {
      s.stop('Docker initialization failed', 1)
      throw err
    }
    s.stop('Docker ready')
  }

  s.start('Starting up DHIS2')
  try {
    await waitUntilReady(baseUrl)
  } catch (err) {
    s.stop('DHIS2 failed to become ready', 1)
    throw err
  }
  s.stop(`DHIS2 ready at ${baseUrl}`)

  await ensurePristineSnapshot(env, baseUrl)

  await applyLoaded(loaded, { silent: true })

  ui.raw('')
  ui.raw(`${pc.bold('Credentials:')} admin / district`)
  ui.raw(`${pc.bold('URL:')}         ${baseUrl}`)
}
