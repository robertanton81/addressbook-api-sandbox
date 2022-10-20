import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { dbConfig, validateDbConfig } from './database/database.config';
import { Options } from '@mikro-orm/core';
import { getEnvPath } from './env-helper';
import * as dotenv from 'dotenv';

const configService = new ConfigService();
const logger = new Logger('MikroORM');

const envFilePath = getEnvPath();
dotenv.config({ path: envFilePath });

validateDbConfig(dbConfig());

const mikroOrmConfig: Options = {
  type: 'postgresql',
  dbName: configService.get('POSTGRES_DB'),
  user: configService.get('POSTGRES_USER'),
  password: configService.get('POSTGRES_PASSWORD'),
  host: configService.get('POSTGRES_HOST'),
  port: configService.get('POSTGRES_PORT'),
  highlighter: new SqlHighlighter(),
  metadataProvider: TsMorphMetadataProvider,
  logger: logger.log.bind(logger),
  entities: ['dist/**/*.entity.js'],
  entitiesTs: ['src/**/*.entity.ts'],
  migrations: {
    path: 'dist/migrations',
    pathTs: 'src/migrations',
  },
  cache: {
    enabled: true,
    pretty: true,
  },
};

export default mikroOrmConfig;
