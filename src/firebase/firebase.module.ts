import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  firebaseConfig,
  validateFirebaseConfig,
} from './config/firebase.config';
import { getEnvPath } from '../config/get-env-path';
import { FirebaseService } from './service/firebase.service';

const envFilePath = getEnvPath(__dirname);

@Module({
  imports: [
    // just to show that each module can have own env file and separate validation
    ConfigModule.forRoot({
      envFilePath,
      load: [firebaseConfig],
      cache: true,
      validate: validateFirebaseConfig,
    }),
  ],
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
