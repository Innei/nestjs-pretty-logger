import cluster from 'node:cluster'
import picocolors from 'picocolors'
import type { WrappedConsola } from '@innei/pretty-logger-core'
import type { ConsoleLoggerOptions } from '@nestjs/common'

import { createLoggerConsola } from '@innei/pretty-logger-core'
import { ConsoleLogger } from '@nestjs/common'

type LogLevel =
  | 'info'
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'verbose'
  | 'fatal'

export class Logger extends ConsoleLogger {
  private static loggerInstance = createLoggerConsola()

  static setLoggerInstance(logger: WrappedConsola) {
    this.loggerInstance = logger
  }

  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context || '', options || {})
  }

  private lastTimestampAt: number = Date.now()
  private _updateAndGetTimestampDiff() {
    const includeTimestamp = this.lastTimestampAt && this.options?.timestamp
    const now = Date.now()
    const result = includeTimestamp
      ? picocolors.yellow(` +${now - this.lastTimestampAt}ms`)
      : ''
    this.lastTimestampAt = now
    return result
  }

  private getContextPrefix(context?: string) {
    const ctx = context || this.context
    return ctx ? `[${picocolors.yellow(ctx)}]` : `[${picocolors.red('System')}]`
  }

  private get workerPrefix() {
    return cluster.isWorker
      ? picocolors.yellow(`*Worker - ${cluster.worker!.id}*`)
      : ''
  }

  /**
   * Check if the last argument looks like a NestJS context string.
   * NestJS passes context as the last string argument (e.g., 'AppService', 'UserController').
   * Context strings are typically PascalCase class names.
   */
  private isContextString(value: unknown): value is string {
    if (typeof value !== 'string') return false
    // Context is usually a short PascalCase identifier (class name)
    // Not a sentence, not a path, not containing spaces or special chars
    return /^[A-Z][a-zA-Z0-9]*$/.test(value)
  }

  private print(level: LogLevel, ...args: any[]) {
    const print = Logger.loggerInstance[level] as (...args: any[]) => void
    const diff = this._updateAndGetTimestampDiff()

    let context: string | undefined
    let messages = args

    // Check if the last argument is a context string (NestJS convention)
    if (args.length > 0 && this.isContextString(args.at(-1))) {
      context = args.at(-1)
      messages = args.slice(0, -1)
    }

    const prefix = this.workerPrefix
      ? `${this.workerPrefix} ${this.getContextPrefix(context)}`
      : this.getContextPrefix(context)

    const output = [prefix, ...messages, diff].filter(
      (v) => v !== undefined && v !== '',
    )
    print(...output)
  }

  log(...args: any[]) {
    this.print('info', ...args)
  }

  info(...args: any[]) {
    this.print('info', ...args)
  }

  warn(...args: any[]) {
    this.print('warn', ...args)
  }

  debug(...args: any[]) {
    this.print('debug', ...args)
  }

  verbose(...args: any[]) {
    this.print('verbose', ...args)
  }

  fatal(...args: any[]) {
    this.print('fatal', ...args)
  }

  error(...args: any[]) {
    this.print('error', ...args)
  }
}
