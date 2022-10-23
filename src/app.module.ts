import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './database/database.config';
import { appConfig, validateAppConfig } from './config/app.config';
import { DatabaseModule } from './database/database.module';
import { getEnvPath } from './config/get-env-path';
import { AppLogerModule } from './app-loger/app-loger.module';
import { ExceptionsInterceptor } from './common/interceptors/exceptions.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { authConfig } from './auth/config/auth.config';
import { FirebaseModule } from './firebase/firebase.module';

const envFilePath: string = getEnvPath(__dirname);

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath,
      isGlobal: true,
      load: [appConfig, dbConfig, authConfig],
      cache: true,
      validate: validateAppConfig,
    }),
    DatabaseModule,
    UsersModule,
    AppLogerModule,
    AppLogerModule,
    AuthModule,
    FirebaseModule,
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
