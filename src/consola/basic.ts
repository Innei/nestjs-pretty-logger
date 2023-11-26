import type { ConsolaInstance } from './consola'
import type { LogLevel } from './constants'
import type { ConsolaOptions } from './types'

import { createConsola as _createConsola } from './consola'
import { LogLevels } from './constants'
import { BasicReporter } from './reporters/basic'

export * from './shared'

export function createConsola(
  options: Partial<ConsolaOptions & { fancy: boolean }> = {},
): ConsolaInstance {
  // Log level
  let level: LogLevel = LogLevels.info
  if (process.env.CONSOLA_LEVEL) {
    level = Number.parseInt(process.env.CONSOLA_LEVEL) ?? level
  }

  // Create new consola instance
  const consola = _createConsola({
    level,
    defaults: { level },
    stdout: process.stdout,
    stderr: process.stderr,
    reporters: options.reporters || [new BasicReporter()],
    ...options,
  })

  return consola
}
