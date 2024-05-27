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
    onStdOut: (handler: (data: string) => any) =>
      SubscriberReporter.subscriber.on('stdout', handler),
    onStdErr: (handler: (data: string) => any) =>
      SubscriberReporter.subscriber.on('stderr', handler),
  })
  // @ts-expect-error
  return consola
}

export class SubscriberReporter extends LoggerReporter {
  static subscriber = new EventEmitter()
  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    const line = super.formatLogObj(logObj, ctx)
    const event = logObj.level < 2 ? 'stderr' : 'stdout'
    SubscriberReporter.subscriber.emit(event, line)
    SubscriberReporter.subscriber.emit('log', line)
  }
}
