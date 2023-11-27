import type { ConsolaInstance } from './consola'
import type { LogLevel, LogType } from './constants'

export interface ConsolaOptions {
  reporters: ConsolaReporter[]
  types: Record<LogType, InputLogObject>
  level: LogLevel
  defaults: InputLogObject
  throttle: number
  throttleMin: number
  stdout?: NodeJS.WriteStream
  stderr?: NodeJS.WriteStream
  mockFn?: (type: LogType, defaults: InputLogObject) => (...args: any) => void
  formatOptions: FormatOptions
}

/**
 * @see https://nodejs.org/api/util.html#util_util_inspect_object_showhidden_depth_colors
 */
export interface FormatOptions {
  columns?: number
  date?: boolean
  colors?: boolean
  compact?: boolean | number
  [key: string]: unknown
}

export interface InputLogObject {
  level?: LogLevel
  tag?: string
  type?: LogType
  message?: string
  additional?: string | string[]
  args?: any[]
  date?: Date
}

export interface LogObject extends InputLogObject {
  level: LogLevel
  type: LogType
  tag: string
  args: any[]
  date: Date
  [key: string]: unknown
}

export interface ConsolaReporter {
  log: (
    logObj: LogObject,
    ctx: {
      options: ConsolaOptions
    },
  ) => void
}

export interface WrappedConsola extends ConsolaInstance {
  onData: (handler: (data: string) => any) => WrappedConsola
  onStdOut: (handler: (data: string) => any) => WrappedConsola
  onStdErr: (handler: (data: string) => any) => WrappedConsola
}
