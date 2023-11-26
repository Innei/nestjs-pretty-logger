import EventEmitter from 'events'
import type { ConsolaInstance } from '../consola'
import type { ConsolaOptions, LogObject, WrappedConsola } from '../types'

import { LoggerReporter } from './logger'

export const wrapperSubscribers = (
  consola: ConsolaInstance,
): WrappedConsola => {
  Object.assign(consola, {
    onData: (handler: (data: string) => any) =>
      SubscriberReporter.subscriber.on('log', handler),
  })
  // @ts-expect-error
  return consola
}

export class SubscriberReporter extends LoggerReporter {
  static subscriber = new EventEmitter()
  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    const line = super.formatLogObj(logObj, ctx)
    SubscriberReporter.subscriber.emit('log', line)
  }
}
