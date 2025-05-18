import path from 'node:path';

import { createLogger,Logger } from '@innei/pretty-logger-nestjs';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

const customLogger = createLogger({
  writeToFile: {
    loggerDir: path.resolve(__dirname, './logs'),
  },
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  Logger.setLoggerInstance(customLogger);
  app.useLogger(app.get(Logger));
  await app.listen(3000);
}
bootstrap();
