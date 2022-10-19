import { registerAs } from '@nestjs/config';
import { IsNumber, IsString } from 'class-validator';
import { validateConfig } from '../common/validation/config.validate';

const dbConfig = registerAs('db', () => ({
  POSTGRES_PORT: parseInt(process.env.POSTGRES_PORT),
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_DB: process.env.POSTGRES_DB,
}));

class EnvironmentVariables {
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
}

const validateDbConfig = (config: Record<string, unknown>) =>
  validateConfig<EnvironmentVariables>(config, EnvironmentVariables);

export { dbConfig, validateDbConfig };
