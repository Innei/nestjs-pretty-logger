# demo

Sample NestJS app in this monorepo that wires **`@innei/pretty-logger-nestjs`** into `AppModule` and `main.ts`, including optional log directory output under `./logs` (see `src/main.ts`).

## Prerequisites

- Node.js compatible with the repo
- [pnpm](https://pnpm.io) (version in root `package.json` `packageManager` field)

## Install

From the **repository root**:

```bash
pnpm install
```

## Run (watch mode)

```bash
pnpm --filter demo dev
```

This runs `nest start --watch` (see `nodemon.json`).

## Other scripts

| Command | Description |
| --- | --- |
| `pnpm --filter demo start:prod` | Run compiled `dist/main` |
| `pnpm --filter demo start:debug` | Nest debug + watch |
| `pnpm --filter demo test` | Jest unit tests |

## Layout

- `src/main.ts` — `createLogger` + `Logger.setLoggerInstance` + `app.useLogger`
- `src/app.module.ts` — imports `LoggerModule`

Published packages live under `packages/`; this app depends on them via `workspace:*`.
