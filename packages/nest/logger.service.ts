import cluster from 'node:cluster'
import picocolors from 'picocolors'
import type { WrappedConsola } from '@innei/pretty-logger-core'
import type { ConsoleLoggerOptions } from '@nestjs/common'

import { createLoggerConsola } from '@innei/pretty-logger-core'
import { ConsoleLogger } from '@nestjs/common'

type ConsolaPrintLevel =
  | 'info'
  | 'error'
  | 'warn'
  | 'debug'
  | 'verbose'
  | 'fatal'

/**
 * Pretty TTY/file Nest logger. Does not implement ConsoleLogger `json` /
 * `flattenParams` modes — use Nest's built-in JSON logger for that path.
 */
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

  private flush(
    level: ConsolaPrintLevel,
    messages: unknown[],
    context?: string,
    params?: Record<string, unknown>,
    stack?: unknown,
  ) {
    const print = Logger.loggerInstance[level] as (...args: any[]) => void
    const diff = this._updateAndGetTimestampDiff()
    const prefix = this.workerPrefix
      ? `${this.workerPrefix} ${this.getContextPrefix(context)}`
      : this.getContextPrefix(context)

    const output = [prefix, ...messages, params, stack, diff].filter(
      (v) => v !== undefined && v !== '',
    )
    print(...output)
  }

  log(...args: any[]) {
    if (!this.isLevelEnabled('log')) {
      return
    }
    const { messages, context, params } =
      this.getContextAndMessagesToPrint(args)
    this.flush('info', messages, context, params)
  }

  info(...args: any[]) {
    this.log(...args)
  }

  warn(...args: any[]) {
    if (!this.isLevelEnabled('warn')) {
      return
    }
    const { messages, context, params } =
      this.getContextAndMessagesToPrint(args)
    this.flush('warn', messages, context, params)
  }

  debug(...args: any[]) {
    if (!this.isLevelEnabled('debug')) {
      return
    }
    const { messages, context, params } =
      this.getContextAndMessagesToPrint(args)
    this.flush('debug', messages, context, params)
  }

  verbose(...args: any[]) {
    if (!this.isLevelEnabled('verbose')) {
      return
    }
    const { messages, context, params } =
      this.getContextAndMessagesToPrint(args)
    this.flush('verbose', messages, context, params)
  }

  fatal(...args: any[]) {
    if (!this.isLevelEnabled('fatal')) {
      return
    }
    const { messages, context, params } =
      this.getContextAndMessagesToPrint(args)
    this.flush('fatal', messages, context, params)
  }

  error(...args: any[]) {
    if (!this.isLevelEnabled('error')) {
      return
    }
    const { messages, context, stack, params } =
      this.getContextAndStackAndMessagesToPrint(args)
    this.flush('error', messages, context, params, stack)
  }
}
