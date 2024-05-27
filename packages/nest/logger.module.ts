import type { ConsolaInstance } from '@innei/pretty-logger-core'
import type { DynamicModule } from '@nestjs/common'

import { createLoggerConsola } from '@innei/pretty-logger-core'
import { Module } from '@nestjs/common'

import { Logger } from './logger.service.js'

interface LoggerModuleOptions {
  consola: ConsolaInstance
}
@Module({ providers: [Logger], exports: [Logger] })
export class LoggerModule {
  static forFeature(options?: LoggerModuleOptions): DynamicModule {
    const { consola } = options || {}
    return {
      module: LoggerModule,
      providers: [
        {
          provide: 'L',
          useValue: consola || createLoggerConsola(),
        },
      ],
    }
  }
}
