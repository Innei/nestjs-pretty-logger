# @innei/pretty-logger-core

[![npm version](https://img.shields.io/npm/v/@innei/pretty-logger-core.svg)](https://www.npmjs.com/package/@innei/pretty-logger-core)

Framework-agnostic logging built on an embedded [consola](https://github.com/unjs/consola)-compatible stack: fancy terminal output, optional log files with rotation-friendly filenames, and hooks for streaming or recording log lines.

## When to use this package

Use **`@innei/pretty-logger-core`** when you want the pretty logger **without NestJS**—for CLIs, workers, or other Node apps—while keeping the same reporters and `createLoggerConsola` behavior as the Nest integration.

For NestJS applications, prefer [`@innei/pretty-logger-nestjs`](../nest/README.md), which wraps this package for `Logger` and `LoggerModule`.

## Installation

```bash
pnpm add @innei/pretty-logger-core
# or: npm i @innei/pretty-logger-core
```

## Quick start

```typescript
import { createLoggerConsola } from '@innei/pretty-logger-core'

const logger = createLoggerConsola()
logger.info('hello')
```

## Tags / scopes (layered “namespace”)

Each consola instance can carry a default **tag** shown in log output. Use **`withTag(subtag)`** to fork a child logger; nested calls join tags with `:` (e.g. `api` → `api:users` → `api:users:db`). **`withScope`** is an alias of **`withTag`** (consola-compatible naming).

```typescript
import { createLoggerConsola } from '@innei/pretty-logger-core'

const root = createLoggerConsola()
const api = root.withTag('api')
const users = api.withTag('users')

users.info('created') // tag appears as api:users in reporters that render tag
```

Tags flow through the same reporters and file/hook plumbing as the parent instance.

## Create a logger with file output

```typescript
import path from 'node:path'
import { createLoggerConsola } from '@innei/pretty-logger-core'

const logger = createLoggerConsola({
  writeToFile: {
    loggerDir: path.resolve('./logs'),
    // optional:
    // stdoutFileFormat: 'stdout_%d.log',
    // stderrFileFormat: 'error.log',
    // cron: '0 0 * * *',
    // errWriteToStdout: false,
  },
})
```

## Capture all log output (console + stdout/stderr)

Route `console.*` and `process.stdout` / `process.stderr` through the same logger:

```typescript
logger.wrapAll()
// logger.restoreAll() when finished
```

> [!WARNING]
> After `wrapAll()`, do not call `console.log` (or similar) inside `onData` handlers, or you risk recursive re-entry.

## Real-time hooks

`createLoggerConsola` returns a consola instance extended with subscribers:

```typescript
logger.onData((line) => {
  /* every formatted log line */
})
logger.onStdOut((line) => {
  /* non-error stream */
})
logger.onStdErr((line) => {
  /* error stream */
})
```

## API overview

| Name | Role |
| --- | --- |
| `createLoggerConsola(options?)` | Builds the default logger (fancy reporter + subscriber reporter, optional file reporter). |
| `createConsola` / `consola` | Lower-level factory and default singleton from the embedded consola module. |
| `withTag` / `withScope` | Child logger with a tag prefix; nested tags concatenate with `:`. |
| Reporters (`FancyReporter`, `FileReporter`, `BasicReporter`, …) | Compose or customize output targets. |
| `LoggerConsolaOptions` | Options including `writeToFile: FileReporterConfig` and other `ConsolaOptions` fields. |

Log level in development follows `std-env` (`trace` in dev, `info` otherwise unless overridden). You can also set `CONSOLA_LEVEL` in the environment.

## See also

- [Repository root](../../readme.md) — monorepo overview and full NestJS examples
- [`@innei/pretty-logger-nestjs`](../nest/README.md) — Nest `Logger` + `LoggerModule`
