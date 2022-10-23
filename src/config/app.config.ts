import { registerAs } from '@nestjs/config';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { validateConfig } from '../common/validation/config.validate';

interface IAppConfig {
  port: number;
  env: string;
}

const appConfig = registerAs('app', async () => ({
  env: process.env.NODE_ENV,
  port: process.env.PORT,
}));

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
  Provision = 'provision',
}

class EnvironmentVariables {
  // APP
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  // DB
  @IsNumber()
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_HOST: string;

  @IsString()
  POSTGRES_USER: string;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_DB: string;

  // AUTH
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_TOKEN_EXPIRES: string;
}

const validateAppConfig = (config: Record<string, unknown>) =>
  validateConfig<EnvironmentVariables>(config, EnvironmentVariables);

export { IAppConfig, validateAppConfig, appConfig };
