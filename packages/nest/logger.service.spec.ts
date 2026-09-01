import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Logger } from './logger.service'

function stripAnsi(value: string) {
  return value.replace(/\u001B\[[0-9;]*m/g, '')
}

function createMockConsola() {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
    verbose: vi.fn(),
    fatal: vi.fn(),
  }
}

describe('Logger', () => {
  let consola: ReturnType<typeof createMockConsola>

  beforeEach(() => {
    consola = createMockConsola()
    Logger.setLoggerInstance(consola as any)
  })

  it('treats trailing context and a plain object as one consola call with params', () => {
    const logger = new Logger()
    logger.log('msg', { userId: 1 }, 'UserService')

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(stripAnsi(args[0])).toBe('[UserService]')
    expect(args[1]).toBe('msg')
    expect(args[2]).toEqual({ userId: 1 })
    expect(args).toHaveLength(3)
  })

  it('merges extra plain objects into one params argument', () => {
    const logger = new Logger()
    logger.log('msg', { a: 1 }, { b: 2 })

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(args[1]).toBe('msg')
    expect(args[2]).toEqual({ a: 1, b: 2 })
    expect(args).toHaveLength(3)
  })

  it('keeps objects as extra message args when structuredParams is false', () => {
    const logger = new Logger('', { structuredParams: false })
    logger.log('msg', { a: 1 }, { b: 2 })

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(args[1]).toBe('msg')
    expect(args[2]).toEqual({ a: 1 })
    expect(args[3]).toEqual({ b: 2 })
    expect(args).toHaveLength(4)
  })

  it('treats a trailing non-PascalCase string as context', () => {
    const logger = new Logger()
    logger.log('msg', 'my-context')

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(stripAnsi(args[0])).toBe('[my-context]')
    expect(args[1]).toBe('msg')
  })

  it('passes error stack and context through to consola', () => {
    const logger = new Logger()
    const stack =
      'Error: boom\n    at UserService.create (user.service.ts:10:5)'
    logger.error('boom', stack, 'UserService')

    expect(consola.error).toHaveBeenCalledTimes(1)
    const args = consola.error.mock.calls[0]
    expect(stripAnsi(args[0])).toBe('[UserService]')
    expect(args[1]).toBe('boom')
    expect(args[2]).toBe(stack)
  })

  it('honors logLevels and suppresses log/warn when only error is enabled', () => {
    const logger = new Logger('', { logLevels: ['error'] })
    logger.log('hidden')
    logger.warn('hidden')

    expect(consola.info).not.toHaveBeenCalled()
    expect(consola.warn).not.toHaveBeenCalled()

    logger.error('visible')
    expect(consola.error).toHaveBeenCalledTimes(1)
    expect(consola.error.mock.calls[0][1]).toBe('visible')
  })
})
