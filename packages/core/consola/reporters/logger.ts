/* eslint-disable prefer-rest-params */
import picocolors from 'picocolors'
import { isDevelopment } from 'std-env'
import type { FormatOptions, LogObject } from '../types'

import { getShortTime } from '../../tool.util'
import { FancyReporter } from './fancy'

export class LoggerReporter extends FancyReporter {
  private latestLogTime: number = Date.now()
  public formatDate(date: Date, opts: FormatOptions): string {
    const isInVirtualTerminal = typeof opts.columns === 'undefined'
    if (isDevelopment) {
      const now = Date.now()
      const delta = now - this.latestLogTime
      this.latestLogTime = now
      return `+${delta | 0}ms ${super.formatDate(date, opts)}`
    }

    return isInVirtualTerminal ? '' : super.formatDate(date, opts)
  }

  public formatLogObj(logObj: LogObject, opts: FormatOptions): string {
    const isInVirtualTerminal = typeof opts.columns === 'undefined'
    return isInVirtualTerminal
      ? `${picocolors.gray(getShortTime(new Date()))} ${super
          .formatLogObj(logObj, opts)
          .replace(/^\n/, '')}`.trimEnd()
      : super.formatLogObj(logObj, opts)
  }
}
