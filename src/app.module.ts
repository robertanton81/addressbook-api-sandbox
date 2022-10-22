import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './database/database.config';
import { appConfig, validateAppConfig } from './app.config';
import { DatabaseModule } from './database/database.module';
import { getEnvPath } from './env-helper';
import { AppLogerModule } from './app-loger/app-loger.module';
import { ExceptionsInterceptor } from './common/interceptors/exceptions.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';

const envFilePath: string = getEnvPath();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      load: [appConfig, dbConfig],
      cache: true,
      validate: validateAppConfig,
    }),
    DatabaseModule,
    UsersModule,
    AppLogerModule,
    AppLogerModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ExceptionsInterceptor,
    },
  ],
})
export class AppModule {}
