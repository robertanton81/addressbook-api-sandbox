import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { ContactsRepository } from '../repository/contacts.repository';
import { AddressBook } from './address-book.entity';

@Entity({ customRepository: () => ContactsRepository })
export class Contact extends BaseEntity {
  [EntityRepositoryType]?: ContactsRepository;

  @ApiProperty()
  @Property({ length: 255 })
  firstName: string;

  @ApiProperty()
  @Property({ length: 255 })
  lastName: string;

  @ApiProperty()
  @Property({ length: 255 })
  phoneNumber: string;

  @ApiProperty()
  @Property({ length: 255 })
  address: string;

  @ApiProperty()
  @ManyToOne(() => AddressBook)
  addressBook: AddressBook;
}
