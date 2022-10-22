import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../common/validation/config.validate';

const authConfig = registerAs('auth', () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_EXPIRES: process.env.JWT_TOKEN_EXPIRES,
}));

class EnvironmentVariables {
  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_TOKEN_EXPIRES: string;
}

const validateAuthConfig = (config: Record<string, unknown>) =>
  validateConfig<EnvironmentVariables>(config, EnvironmentVariables);

export { authConfig, validateAuthConfig };
