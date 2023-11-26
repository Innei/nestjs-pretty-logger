import cluster from 'cluster'
import EventEmitter from 'events'
import picocolors from 'picocolors'
import type { ConsoleLoggerOptions } from '@nestjs/common'

import { ConsoleLogger } from '@nestjs/common'

import { consola } from './consola.instance.js'

type LoggerType =
  | 'info'
  | 'log'
  | 'error'
  | 'warn'
  | 'debug'
  | 'verbose'
  | 'fatal'

export class Logger extends ConsoleLogger {
  public static subscriber = new EventEmitter()

  constructor(context: string, options: ConsoleLoggerOptions) {
    super(context, options)
  }
  private _getColorByLogLevel(logLevel: string) {
    switch (logLevel) {
      case 'debug':
        return picocolors.cyan
      case 'warn':
        return picocolors.yellow
      case 'error':
        return picocolors.red
      case 'verbose':
        return picocolors.gray
      default:
        return picocolors.green
    }
  }

  private lastTimestampAt: number = Date.now()
  private _updateAndGetTimestampDiff() {
    const includeTimestamp = this.lastTimestampAt && this.options.timestamp
    const now = Date.now()
    const result = includeTimestamp
      ? picocolors.yellow(` +${now - this.lastTimestampAt}ms`)
      : ''
    this.lastTimestampAt = now
    return result
  }
  protected formatMessage(message: any, logLevel = 'log') {
    const formatMessage =
      typeof message == 'string'
        ? this._getColorByLogLevel(logLevel)(message)
        : message
    return formatMessage
  }

  log(message: any, context?: string, ...argv: any[]) {
    this.print('info', message, context, ...argv)
  }

  warn(message: any, context?: string, ...argv: any[]) {
    this.print('warn', message, context, ...argv)
  }
  debug(message: any, context?: string, ...argv: any[]) {
    this.print('debug', message, context, ...argv)
  }

  verbose(message: any, context?: string, ...argv: any[]) {
    this.print('verbose', message, context, ...argv)
  }

  fatal(message: any, context?: string, ...argv: any[]) {
    this.print('fatal', message, context, ...argv)
  }

  error(message: any, context?: string, ...argv: any[]) {
    const trace = context
    const _context = argv[0]

    if (!trace && _context) {
      this.print('error', message, _context, ...argv.slice(1))
    } else {
      this.print('error', message, context, ...argv)
    }
  }

  private print(
    level: LoggerType,
    message: any,
    context?: string,
    ...argv: any[]
  ) {
    const print = consola[level]
    const formatMessage = this.formatMessage(message, level)
    const diff = this._updateAndGetTimestampDiff()

    const workerPrefix = cluster.isWorker
      ? picocolors.yellow(`*Worker - ${cluster!.worker!.id}*`)
      : ''
    if (context && !argv.length) {
      print(
        `${workerPrefix} [${picocolors.yellow(context)}] `,
        formatMessage,
        diff,
      )
    } else if (!argv.length) {
      print(`${workerPrefix} ${this.defaultContextPrefix}`, formatMessage, diff)
    } else {
      print(
        `${workerPrefix} ${this.defaultContextPrefix}`,
        message,
        context,
        ...argv,
        diff,
      )
    }
  }

  private defaultContextPrefix = this.context
    ? `[${picocolors.yellow(this.context)}] `
    : `[${picocolors.red('System')}] `
}
