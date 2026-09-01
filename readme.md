# NestJS Pretty Logger

![NestJS Pretty Logger](https://cdn.jsdelivr.net/gh/Innei/fancy-2023@main/2023/1126201123.png)

[![npm](https://img.shields.io/npm/v/@innei/pretty-logger-nestjs.svg)](https://www.npmjs.com/package/@innei/pretty-logger-nestjs)
[![GitHub](https://img.shields.io/badge/GitHub-Innei%2Fnestjs--pretty--logger-24292f?logo=github)](https://github.com/Innei/nestjs-pretty-logger)

Pretty, practical logging for Node and NestJS: terminal-friendly output inspired by [consola](https://github.com/unjs/consola), optional **log files** with date-based names and scheduled stream refresh, **`wrapAll`** to capture `console` and stdio, and **`onData` / `onStdOut` / `onStdErr`** hooks for live forwarding (WebSockets, aggregators, etc.).

## Monorepo packages

| Package | Description |
| --- | --- |
| [`@innei/pretty-logger-nestjs`](packages/nest/README.md) | NestJS `Logger`, `LoggerModule`, and `createLogger`. **Start here for Nest apps.** |
| [`@innei/pretty-logger-core`](packages/core/README.md) | Framework-agnostic logger and reporters; powers the Nest package. |
| [`demo`](demo/README.md) | Example Nest app using the workspace packages. |

> [!TIP]
> On npm, install **`@innei/pretty-logger-nestjs`** for NestJS. Use **`@innei/pretty-logger-core`** only if you need the logger outside Nest.

## Install (NestJS)

```bash
pnpm add @innei/pretty-logger-nestjs
# or: npm i @innei/pretty-logger-nestjs
```

Requires `@nestjs/common` ^12 (NestJS 12 only).

## Usage (NestJS)

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

### Custom logger: files, wrap-all, hooks

```typescript
import path from 'node:path'
import { createLogger, Logger } from '@innei/pretty-logger-nestjs'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

const customLogger = createLogger({
  writeToFile: {
    loggerDir: path.resolve(__dirname, './logs'),
  },
})

customLogger.wrapAll()
customLogger.onData((data) => {})
customLogger.onStdErr((data) => {})
customLogger.onStdOut((data) => {})

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  Logger.setLoggerInstance(customLogger)
  app.useLogger(app.get(Logger))
  await app.listen(3000)
}
bootstrap()
```

Structured params (Nest 12 default): `logger.log('User created', { userId: 1 })` attaches the object as metadata of that entry. Set `structuredParams: false` on the logger options to keep objects as extra message arguments. `logLevels` are honored. This package is the pretty TTY/file path — it does not implement Nest `json` / `flattenParams`.

> [!WARNING]
> After `wrapAll()`, avoid using `console.log` (or other wrapped stdio) inside `onData` to prevent feedback loops.

### File options (`writeToFile`)

When using `createLogger({ writeToFile: { ... } })`:

| Field | Purpose |
| --- | --- |
| `loggerDir` | **Required.** Directory for log files. |
| `stdoutFileFormat` | Optional. Default `stdout_%d.log` (`%d` = date segment). |
| `stderrFileFormat` | Optional. Default `error.log`. |
| `cron` | Optional cron expression to refresh write streams. Default `0 0 * * *`. |
| `errWriteToStdout` | Optional. Whether error logs also go to stdout stream. Default `false`. |

## Develop in this repo

```bash
pnpm install
pnpm build
pnpm test
```

Run the sample app: `pnpm --filter demo dev` — see [`demo/README.md`](demo/README.md).

---

[Personal site](https://innei.in/) · GitHub [@Innei](https://github.com/innei/)
