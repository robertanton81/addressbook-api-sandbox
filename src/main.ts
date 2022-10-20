import { MikroORM } from '@mikro-orm/core';
import {
  ClassSerializerInterceptor,
  Logger,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { IAppConfig } from './app.config';
import { AppModule } from './app.module';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
    { cors: true },
  );

  // Get app config for cors settings and starting the app.
  const configService = app.get(ConfigService);
  const appConfig = configService.get<IAppConfig>('app');

  // DANGER! this just overwrites database with schema defined based on entities !!!
  await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
  await app.get(MikroORM).getMigrator().up();
  // await app.get(MikroORM).getSchemaGenerator().updateSchema();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.useGlobalInterceptors(
    new ClassSerializerInterceptor(app.get(TsMorphMetadataProvider)),
  );

  await app.listen(appConfig.port);

  Logger.log(`listening on ${appConfig.port}`);
  Logger.log(`Runinng in ${appConfig.env}`);
}
bootstrap();
