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

  it('treats a trailing PascalCase string as Nest context', () => {
    const logger = new Logger()
    logger.log('msg', { userId: 1 }, 'UserService')

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(stripAnsi(args[0])).toBe('[UserService]')
    expect(args[1]).toBe('msg')
    expect(args[2]).toEqual({ userId: 1 })
  })

  it('keeps extra objects as separate message args', () => {
    const logger = new Logger()
    logger.log('msg', { a: 1 }, { b: 2 })

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(stripAnsi(args[0])).toBe('[System]')
    expect(args[1]).toBe('msg')
    expect(args[2]).toEqual({ a: 1 })
    expect(args[3]).toEqual({ b: 2 })
  })

  it('keeps a trailing non-PascalCase string as a message, not context', () => {
    const logger = new Logger()
    logger.log('msg', 'my-context')

    expect(consola.info).toHaveBeenCalledTimes(1)
    const args = consola.info.mock.calls[0]
    expect(stripAnsi(args[0])).toBe('[System]')
    expect(args[1]).toBe('msg')
    expect(args[2]).toBe('my-context')
  })

  it('passes error stack through as a message arg with PascalCase context', () => {
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

  it('always prints debug even when logLevels omit it', () => {
    const logger = new Logger('', { logLevels: ['error'] })
    logger.debug('still-visible')
    logger.log('also-visible')

    expect(consola.debug).toHaveBeenCalledTimes(1)
    expect(consola.debug.mock.calls[0][1]).toBe('still-visible')
    expect(consola.info).toHaveBeenCalledTimes(1)
    expect(consola.info.mock.calls[0][1]).toBe('also-visible')
  })
})
