import { isDevelopment } from 'std-env'

import { createConsola, LogLevels } from './consola'
import { LoggerReporter } from './consola/reporters/logger'

export const consola = createConsola({
  formatOptions: {
    date: true,
  },

  reporters: [new LoggerReporter()],
  level: isDevelopment ? LogLevels.trace : LogLevels.info,
})
