import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import serviceAccount from '../config/firebase-adminsdk-strv-address-book.json';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CatchAll } from '../../common/decorators/try-catch-decorator';
import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { FirebaseUsersRepository } from '../repository/firebase-users.repository';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: App;
  private readonly firebaseAuth: Auth;
  private readonly firestore;

  constructor(
    private readonly firebaseUserRepository: FirebaseUsersRepository,
    @Inject(firebaseConfig.KEY)
    private firebaseConfigService: ConfigType<typeof firebaseConfig>,
  ) {
    this.getFirebaseApp();
    this.firestore = admin.firestore();
    this.firebaseAuth = admin.auth();
  }

  @CatchAll((err, ctx) => {
    debugger;
  })
  private getFirebaseApp() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: this.firebaseConfigService.DATABASE_URL,
    });
  }

  @CatchAll((err, ctx) => {
    debugger;
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  })
  async createFirebaseUser(user: CreateUserDto) {
    return this.firebaseAuth.createUser(user);
  }
}
