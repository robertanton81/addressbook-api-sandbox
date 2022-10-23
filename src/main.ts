import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory, Reflector } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { IAppConfig } from './app.config';
import { AppModule } from './app.module';
import fastifyHelmet from '@fastify/helmet';
import { configureSwagger } from './config/swagger/configureSwagger';
import { configureLogger } from './config/logger/configure.logger';
import { configureDb } from './database/configure.database';

// TODO: add HMR webpack
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true, bufferLogs: true },
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  const logger = configureLogger(app);
  await configureDb(app, logger);
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
  configureSwagger(app);

  // start the app
  await app.listen(appConfig.port);
  logger.log(`listening on ${appConfig.port}`);
  logger.log(`Running in ${appConfig.env}`);
}

bootstrap();
