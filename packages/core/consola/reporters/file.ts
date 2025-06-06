import type { WriteStream } from 'node:fs'
import { createWriteStream } from 'node:fs'
import * as fs from 'node:fs'
import { dirname } from 'node:path'

import { CronJob } from 'cron'

import { getLogFilePath } from '../../tool.util'
import type { ConsolaOptions, LogObject } from '../types'
import { writeStream } from '../utils/stream'
import { LoggerReporter } from './logger'

export interface FileReporterConfig {
  loggerDir: string
  /**
   * @default 'stdout_%d%.log'
   */
  stdoutFileFormat?: string
  /**
   * @default 'error.log'
   */
  stderrFileFormat?: string

  /**
   * refresh logger file stream
   * @default '0 0 * * *'
   */
  cron?: string

  /**
   * Error log will be written to stdout and stderr
   * @default false
   */
  errWriteToStdout?: boolean
}

export class FileReporter extends LoggerReporter {
  constructor(private readonly configs: FileReporterConfig) {
    super()
    this.refreshWriteStream()

    this.scheduleRefreshWriteStream()
  }

  private stdoutStream?: WriteStream
  private stderrStream?: WriteStream

  private __job?: CronJob

  private scheduleRefreshWriteStream() {
    const { cron = '0 0 * * *' } = this.configs
    const job = new CronJob(cron, this.refreshWriteStream.bind(this))
    job.start()

    this.__job = job
  }

  teardown() {
    this.__job?.stop()
    this.stdoutStream?.end()
    this.stderrStream?.end()
  }

  private refreshWriteStream() {
    const {
      loggerDir,
      stderrFileFormat = 'error.log',
      stdoutFileFormat = 'stdout_%d.log',
    } = this.configs

    const stdoutPath = getLogFilePath(loggerDir, stdoutFileFormat)
    const stderrPath = getLogFilePath(loggerDir, stderrFileFormat)

    createLoggerFileIfNotExist(stdoutPath)
    createLoggerFileIfNotExist(stderrPath)

    const options = {
      encoding: 'utf-8',
      flags: 'a+',
    } as const

    ;[this.stderrStream, this.stdoutStream].forEach((stream) => {
      stream?.end()
    })

    this.stdoutStream = createWriteStream(stdoutPath, options)
    this.stderrStream = createWriteStream(stderrPath, options)
    ;[this.stderrStream, this.stdoutStream].forEach((stream) => {
      writeStream(
        '\n========================================================\n',
        stream,
      )
    })
  }

  log(logObj: LogObject, ctx: { options: ConsolaOptions }) {
    if (!this.stdoutStream || !this.stderrStream) {
      return
    }
    const finalStdout = this.stdoutStream
    const finalStderr = this.stderrStream || this.stdoutStream
    const line = super.formatLogObj(logObj, {
      ...ctx.options.formatOptions,
      columns: undefined,
    })

    if (this.configs.errWriteToStdout && logObj.level < 2) {
      writeStream(`${line}\n`, finalStdout)
    }
    return writeStream(
      `${line}\n`,
      logObj.level < 2 ? finalStderr : finalStdout,
    )
  }
}

function createLoggerFileIfNotExist (path: string) {
  const dirPath = dirname(path)

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }

  if (!fs.existsSync(path)) {
    fs.writeFileSync(path, '', { flag: 'wx' })
  }
}
