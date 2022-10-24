import { Module } from '@nestjs/common';
import { AddressBookService } from './service/address-book.service';
import { AddressBookController } from './controller/address-book.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AddressBook } from './entities/address-book.entity';
import { Contact } from './entities/contact.entity';

@Module({
  imports: [MikroOrmModule.forFeature({ entities: [AddressBook, Contact] })],
  controllers: [AddressBookController],
  providers: [AddressBookService],
})
export class AddressBookModule {}
