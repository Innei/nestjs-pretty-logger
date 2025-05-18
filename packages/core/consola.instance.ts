import { isDevelopment } from 'std-env'

import type { ConsolaOptions, ConsolaReporter } from './consola'
import { createConsola, LogLevels } from './consola'
import { FancyReporter } from './consola/reporters/fancy'
import type { FileReporterConfig } from './consola/reporters/file'
import { FileReporter } from './consola/reporters/file'
import {
  SubscriberReporter,
  wrapperSubscribers,
} from './consola/reporters/subscriber'

export interface LoggerConsolaOptions extends Partial<ConsolaOptions> {
  writeToFile?: FileReporterConfig
}

export function createLoggerConsola (options?: LoggerConsolaOptions) {
  const reporters: ConsolaReporter[] = [
    new FancyReporter(),
    new SubscriberReporter(),
  ]
  if (options?.writeToFile) {
    reporters.push(new FileReporter(options.writeToFile))
  }
  const consola = createConsola({
    formatOptions: {
      date: true,
    },

    reporters,
    level: isDevelopment ? LogLevels.trace : LogLevels.info,
    ...options,
  })

  return wrapperSubscribers(consola)
}
