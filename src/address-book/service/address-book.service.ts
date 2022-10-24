import { Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { FirebaseService } from '../../firebase/service/firebase.service';

@Injectable()
export class AddressBookService {
  constructor(private readonly fireBaseService: FirebaseService) {}
  addContact(user: User) {}
}
