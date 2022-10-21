import { MikroORM } from '@mikro-orm/core';
import {
  ClassSerializerInterceptor,
  Logger,
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

// TODO: add swagger
// TODO: add HMR webpack
async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true, logger: ['error', 'warn', 'log'] },
  );

  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getMigrator().up();
  // setup globaly basic security headers
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

  Logger.log(`listening on ${appConfig.port}`);
  Logger.log(`Runinng in ${appConfig.env}`);
}

bootstrap();
