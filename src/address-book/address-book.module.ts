import { Module } from '@nestjs/common';
import { AddressBookService } from './service/address-book.service';
import { AddressBookController } from './controller/address-book.controller';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  imports: [FirebaseModule],
  controllers: [AddressBookController],
  providers: [AddressBookService],
})
export class AddressBookModule {}
