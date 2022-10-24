import { Module } from '@nestjs/common';
import { AddressBookService } from './service/address-book.service';
import { AddressBookController } from './controller/address-book.controller';
import { FirebaseModule } from '../firebase/firebase.module';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [FirebaseModule, AuthModule, UsersModule],
  controllers: [AddressBookController],
  providers: [AddressBookService],
})
export class AddressBookModule {}
