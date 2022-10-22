import { MikroORM } from '@mikro-orm/core';
import {
  ClassSerializerInterceptor,
  Logger as NestLogger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { IAppConfig } from './app.config';
import { AppModule } from './app.module';
import fastifyHelmet from '@fastify/helmet';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import { ExceptionsInterceptor } from './common/interceptors/exceptions.interceptor';
import { DataBaseConnectionException } from './common/exceptions/DataBaseConnectionException';

// TODO: add swagger
// TODO: add HMR webpack
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true, bufferLogs: true },
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  // setup logger
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  const logger = new NestLogger('startup');

  app.useGlobalInterceptors(new ExceptionsInterceptor());

  // setup db
  try {
    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getMigrator().up();
  } catch (e) {
    const connErr = new DataBaseConnectionException();
    logger.error(`errCode: ${e.errno} ${connErr.message}`);
  }

  // setup globally basic security headers
  await app.register(fastifyHelmet);

  // setup validation pipes for every endpoint
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // setup serialization for every endpoint
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.listen(appConfig.port);
  logger.log(`listening on ${appConfig.port}`);
  logger.log(`Runinng in ${appConfig.env}`);
}

bootstrap();
