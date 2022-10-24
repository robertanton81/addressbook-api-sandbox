import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { firebaseConfig } from '../config/firebase.config';
import * as admin from 'firebase-admin';
import serviceAccount from '../config/firebase-adminsdk-strv-address-book.json';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { CatchAll } from '../../common/decorators/try-catch-decorator';
import { App } from 'firebase-admin/app';
import { Auth } from 'firebase-admin/auth';
import { AddContactDto } from '../../address-book/dto/add-contact.dto';

@Injectable()
export class FirebaseService {
  private readonly firebaseApp: App;
  private readonly firebaseAuth: Auth;
  private readonly firestore: admin.firestore.Firestore;
  private readonly contactsDb: admin.firestore.CollectionReference;

  constructor(
    @Inject(firebaseConfig.KEY)
    private firebaseConfigService: ConfigType<typeof firebaseConfig>,
  ) {
    this.getFirebaseApp();
    this.firestore = admin.firestore();
    this.firebaseAuth = admin.auth();
    this.contactsDb = admin.firestore().collection('contacts');
  }

  @CatchAll((err, ctx) => {
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  })
  private getFirebaseApp() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
      databaseURL: this.firebaseConfigService.DATABASE_URL,
    });
  }

  @CatchAll((err, ctx) => {
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  })
  async createFirebaseUser(user: CreateUserDto) {
    return this.firebaseAuth.createUser(user);
  }

  @CatchAll((err, ctx) => {
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  })
  async getFirebaseUserByEmail(userEmail: string) {
    return this.firebaseAuth.getUserByEmail(userEmail);
  }

  async addContact(
    contactData: AddContactDto,
    firebaseUser: admin.auth.UserRecord,
  ) {
    try {
      return this.contactsDb.doc(`${contactData.email}`).set({
        ownerUid: firebaseUser.uid,
        firstName: contactData.firstName,
        lastName: contactData.lastName,
        address: contactData.address,
        phoneNumber: contactData.phoneNumber,
      });
    } catch (e) {
      throw e;
    }
  }
}
