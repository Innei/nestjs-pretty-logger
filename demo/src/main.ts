import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, createLogger } from '@innei/pretty-logger-nestjs';
import path from 'path';

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
