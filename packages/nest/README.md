# @innei/pretty-logger-nestjs

[![npm version](https://img.shields.io/npm/v/@innei/pretty-logger-nestjs.svg)](https://www.npmjs.com/package/@innei/pretty-logger-nestjs)

Drop-in NestJS `Logger` that prints through [`@innei/pretty-logger-core`](../core/README.md): readable, colorized lines; optional file logging; and hooks for live log streaming.

This is the pretty TTY / file path. It does **not** implement Nest `ConsoleLogger` `json` or `flattenParams` modes — use Nest's built-in JSON logger if you need machine-readable JSON.

**Peer dependency:** `@nestjs/common` ^12 (NestJS 12 only).

## Breaking changes in 1.0.0

- **Nest 10 / 11 dropped.** Peer is `@nestjs/common` ^12.
- **Context is any trailing string**, not only PascalCase class names. `logger.log('msg', 'my-context')` now uses `my-context` as the Nest context.
- **Extra plain objects merge into one params object** and are passed as a single extra consola argument (not a new core `LogObject` field).
- **`logLevels` are honored.** Previously `debug` / `verbose` always printed; they now follow `isLevelEnabled` (Nest's default levels still include them).

## Installation

```bash
pnpm add @innei/pretty-logger-nestjs @nestjs/common
# or: npm i @innei/pretty-logger-nestjs @nestjs/common
```

## Register the module and app logger

**`app.module.ts`**

```typescript
import { LoggerModule } from '@innei/pretty-logger-nestjs'
import { Module } from '@nestjs/common'

@Module({
  imports: [LoggerModule],
})
export class AppModule {}
```

**`main.ts`**

```typescript
import { Logger } from '@innei/pretty-logger-nestjs'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(Logger))
  await app.listen(3000)
}
bootstrap()
```

## Structured params (Nest 12)

Plain objects after the message are treated as structured metadata of the same log entry (Nest's default; `structuredParams` is on unless you set it to `false`):

```typescript
const logger = new Logger('UserService')
logger.log('User created', { userId: 1 })
// context: UserService, params: { userId: 1 } — one consola call
```

Multiple objects are merged:

```typescript
logger.log('User created', { userId: 1 }, { email: 'a@b.com' })
// params: { userId: 1, email: 'a@b.com' }
```

Opt out with Nest's escape hatch so objects stay as extra message arguments:

```typescript
const logger = new Logger('UserService', { structuredParams: false })
logger.log('User created', { userId: 1 })
```

`logLevels` now actually apply:

```typescript
const logger = new Logger('UserService', {
  logLevels: ['error', 'fatal', 'warn'],
})
logger.debug('skipped')
```

## Custom logger instance (files, wrapAll, hooks)

Use `createLogger` (alias for `createLoggerConsola` from core), optionally call `Logger.setLoggerInstance` before `app.useLogger`:

```typescript
import path from 'node:path'

import { createLogger, Logger } from '@innei/pretty-logger-nestjs'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'

const customLogger = createLogger({
  writeToFile: {
    loggerDir: path.resolve('./logs'),
  },
})

customLogger.wrapAll()

customLogger.onData((line) => {
  // e.g. WebSocket broadcast — avoid console.log here if wrapAll() is enabled
})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  Logger.setLoggerInstance(customLogger)
  app.useLogger(app.get(Logger))
  await app.listen(3000)
}
bootstrap()
```

## Re-exports

- `createLogger` — same as `createLoggerConsola` from core.
- `Core` — namespace re-export of `@innei/pretty-logger-core` (`import * as Core from '@innei/pretty-logger-nestjs'` then `Core.createLoggerConsola`, etc.).
- Types: `LoggerConsolaOptions`, `WrappedConsola`.

## File reporter options

See [`FileReporterConfig` in the core package](../core/README.md#create-a-logger-with-file-output): `loggerDir` (required when using `writeToFile`), optional filename patterns, `cron` for rotating streams, and `errWriteToStdout`.

## See also

- [`@innei/pretty-logger-core`](../core/README.md) — standalone usage and reporter details
- [Repository root](../../readme.md) — developing this monorepo
