import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { dbConfig, validateDbConfig } from './database/database.config';
import { Options } from '@mikro-orm/core';

const configService = new ConfigService();
const logger = new Logger('MikroORM');

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
  cache: {
    enabled: true,
    pretty: true,
  },
};

export default mikroOrmConfig;
