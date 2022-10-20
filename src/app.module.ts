import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { dbConfig } from './database/database.config';
import { appConfig, validateAppConfig } from './app.config';
import { DatabaseModule } from './database/database.module';
import { getEnvPath } from './env-helper';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
