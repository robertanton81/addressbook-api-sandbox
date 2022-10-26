import { registerAs } from '@nestjs/config';
import { IsEmail, IsString } from 'class-validator';
import { validateConfig } from '../../common/validation/config.validate';

const firebaseConfig = registerAs('firebase', () => ({
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
}));

class EnvironmentVariables {
  @IsString()
  FIREBASE_PROJECT_ID: string;
  @IsString()
  FIREBASE_PRIVATE_KEY: string;
  @IsEmail()
  FIREBASE_CLIENT_EMAIL: string;
}

const validateFirebaseConfig = (config: Record<string, unknown>) =>
  validateConfig<EnvironmentVariables>(config, EnvironmentVariables);

export { firebaseConfig, validateFirebaseConfig };
