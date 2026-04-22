import { spinner } from '@clack/prompts'
import type { LoadedConfig } from '../config-loader.ts'
import {
  assertDockerAvailable,
  waitUntilReady,
  webContainerState,
} from '../docker.ts'
import { pristineStatus, restoreFromPristine, withWebStopped } from '../snapshot.ts'
import { ui, pc } from '../ui.ts'
import { applyLoaded } from './apply.ts'
import { baseUrlFor, stackEnvFor, start } from './start.ts'
import { stop } from './stop.ts'

export async function reset(loaded: LoadedConfig, args: readonly string[]): Promise<void> {
  const hard = args.includes('--hard')

  if (hard) {
    ui.step('Hard reset: tearing down stack and volumes')
    await stop(loaded, args)
    await start(loaded, args)
    return
  }

  const env = stackEnvFor(loaded)
  const baseUrl = baseUrlFor(loaded)

  await assertDockerAvailable()

  const state = await webContainerState(env)
  if (state === 'missing') {
    ui.info(`Stack ${pc.cyan(env.project)} is not running — starting from scratch.`)
    await start(loaded, args)
    return
  }

  const status = await pristineStatus(env)
  if (status.kind !== 'fresh') {
    const reason =
      status.kind === 'missing'
        ? 'no pristine snapshot found'
        : `image changed (${status.recordedImage || '(unset)'} → ${status.currentImage})`
    ui.info(`Fast reset unavailable: ${reason}. Falling back to full reset.`)
    await stop(loaded, args)
    await start(loaded, args)
    return
  }

  const s = spinner()
  s.start('Restoring DB from pristine snapshot')
  try {
    await withWebStopped(env, () => restoreFromPristine(env))
  } catch (err) {
    s.stop('DB restore failed', 1)
    throw err
  }
  s.stop('DB restored')

  s.start('Starting up DHIS2')
  try {
    await waitUntilReady(baseUrl)
  } catch (err) {
    s.stop('DHIS2 failed to become ready', 1)
    throw err
  }
  s.stop(`DHIS2 ready at ${baseUrl}`)

  await applyLoaded(loaded, { silent: true })

  ui.raw('')
  ui.raw(`${pc.bold('Credentials:')} admin / district`)
  ui.raw(`${pc.bold('URL:')}         ${baseUrl}`)
}
