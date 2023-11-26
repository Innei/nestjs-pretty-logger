/* eslint-disable prefer-rest-params */
import picocolors from 'picocolors'
import { isDevelopment } from 'std-env'
import type { FormatOptions, LogObject } from '../types'

import { getShortTime } from '../../tool.util'
import { FancyReporter } from './fancy'

export class LoggerReporter extends FancyReporter {
  isInVirtualTerminal = typeof process.stdout.columns === 'undefined' // HACK: if got `undefined` that means in PM2 pty
  private latestLogTime: number = Date.now()
  public formatDate(date: Date, opts: FormatOptions): string {
    if (isDevelopment) {
      const now = Date.now()
      const delta = now - this.latestLogTime
      this.latestLogTime = now
      return `+${delta | 0}ms ${super.formatDate(date, opts)}`
    }

    return this.isInVirtualTerminal ? '' : super.formatDate(date, opts)
  }

  public formatLogObj(logObj: LogObject, opts: FormatOptions): string {
    return this.isInVirtualTerminal
      ? `${picocolors.gray(getShortTime(new Date()))} ${super
          .formatLogObj(logObj, opts)
          .replace(/^\n/, '')}`.trimEnd()
      : super.formatLogObj(logObj, opts)
  }
}
