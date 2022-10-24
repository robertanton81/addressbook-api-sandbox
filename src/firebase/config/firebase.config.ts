import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../common/validation/config.validate';

const firebaseConfig = registerAs('firebase', () => ({
  DATABASE_URL: process.env.DATABASE_URL,
}));

class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;
}

const validateFirebaseConfig = (config: Record<string, unknown>) =>
  validateConfig<EnvironmentVariables>(config, EnvironmentVariables);

export { firebaseConfig, validateFirebaseConfig };
