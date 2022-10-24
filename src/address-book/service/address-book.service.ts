import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { FirebaseService } from '../../firebase/service/firebase.service';
import { AddContactDto } from '../dto/add-contact.dto';
import { auth } from 'firebase-admin';
import UserRecord = auth.UserRecord;
import { UsersService } from '../../users/service/users.service';

@Injectable()
export class AddressBookService {
  constructor(
    private readonly fireBaseService: FirebaseService,
    private readonly usersService: UsersService,
  ) {}

  async addContact(user: User, data: AddContactDto) {
    let firebaseUser: UserRecord;
    try {
      firebaseUser = await this.fireBaseService.getFirebaseUserByEmail(
        user.email,
      );
    } catch (e) {
      if (e.errorInfo.code === 'auth/user-not-found') {
        firebaseUser = await this.fireBaseService.createFirebaseUser({
          email: user.email,
          password: user.password,
        });
      } else {
        throw e;
      }
    }

    if (!user.firebaseUid) {
      await this.usersService.updateUserFirebaseId(firebaseUser.uid, user);
    }
    return this.fireBaseService.addContact(data, firebaseUser);
  }
}
