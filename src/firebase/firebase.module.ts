import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firebaseConfig, validateFirebaseConfig } from './firebase.config';
import { getEnvPath } from '../config/get-env-path';

const envFilePath = getEnvPath(__dirname);

@Module({
  imports: [
    // just to show that each module can have own env file
    ConfigModule.forRoot({
      envFilePath,
      load: [firebaseConfig],
      cache: true,
      validate: validateFirebaseConfig,
    }),
  ],
})
export class FirebaseModule {}
