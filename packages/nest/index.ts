export { LoggerModule } from './logger.module.js'
export { Logger } from './logger.service.js'
export {
  createLoggerConsola as createLogger,
  type LoggerConsolaOptions,
  type WrappedConsola,
} from '@innei/pretty-logger-core'
export * as Core from '@innei/pretty-logger-core'
