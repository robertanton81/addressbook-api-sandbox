import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firebaseConfig } from '../config/firebase.config';
import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../config/firebase-adminsdk-strv-address-book.json';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CatchAll } from '../../common/decorators/try-catch-decorator';
import { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: App;
  private readonly firebaseAuth;

  constructor(
    @Inject(firebaseConfig.KEY)
    private firebaseConfigService: ConfigType<typeof firebaseConfig>,
  ) {
    this.firebaseApp = this.getFirebaseApp();
    this.firebaseAuth = getAuth();
  }

  @CatchAll((err, ctx) => {
    debugger;
  })
  private getFirebaseApp() {
    return admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as ServiceAccount),
      databaseURL: this.firebaseConfigService.DATABASE_URL,
    });
  }

  @CatchAll((err, ctx) => {
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  })
  async createFirebaseUser(user: CreateUserDto) {
    return this.firebaseAuth.createUser(user);
  }
}
