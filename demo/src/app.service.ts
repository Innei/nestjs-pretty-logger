import { Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);
  onModuleInit() {
    this.logger.log('AppService initialized', 'aaaaaa', {}, new Date());
    this.logger.error('AppService initialized');
    this.logger.warn('AppService initialized');
    this.logger.debug('AppService initialized');
    this.logger.verbose('AppService initialized');
    this.logger.fatal('AppService initialized');
  }
  getHello(): string {
    return 'Hello World!';
  }
}
