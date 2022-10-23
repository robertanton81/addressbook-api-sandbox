import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { firebaseConfig, validateFirebaseConfig } from './firebase.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: './src/firebase/envs/.env',
      load: [firebaseConfig],
      cache: true,
      validate: validateFirebaseConfig,
    }),
  ],
})
export class FirebaseModule {}
