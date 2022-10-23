import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import { validateConfig } from '../../common/validation/config.validate';

const firebaseConfig = registerAs('db', () => ({
  API_KEY: process.env.API_KEY,
  AUTH_DOMAIN: process.env.AUTH_DOMAIN,
  STORAGE_BUCKET: process.env.STORAGE_BUCKET,
  PROJECT_ID: process.env.PROJECT_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  DATABASE_URL: process.env.DATABASE_URL,
}));

class EnvironmentVariables {
  @IsString()
  PROJECT_ID: string;

  @IsString()
  FIREBASE_PRIVATE_KEY: string;

  @IsString()
  FIREBASE_CLIENT_EMAIL: string;

  @IsString()
  DATABASE_URL: string;
}

const validateFirebaseConfig = (config: Record<string, unknown>) =>
  validateConfig<EnvironmentVariables>(config, EnvironmentVariables);

export { firebaseConfig, validateFirebaseConfig };
