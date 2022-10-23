import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ExceptionsInterceptor } from '../../common/interceptors/exceptions.interceptor';
import { Logger as NestLogger } from '@nestjs/common/services/logger.service';

export const configureLogger = (app) => {
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(
    new LoggerErrorInterceptor(),
    new ExceptionsInterceptor(),
  );

  return new NestLogger('startup');
};
