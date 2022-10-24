import {
  Collection,
  Entity,
  EntityRepositoryType,
  OneToMany,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { AddressBookRepository } from '../repository/address-book.repository';
import { Contact } from './contact.entity';

@Entity({ customRepository: () => AddressBookRepository })
export class AddressBook extends BaseEntity {
  [EntityRepositoryType]?: AddressBookRepository;

  @ApiProperty()
  @Property({ length: 255, hidden: true })
  @Exclude()
  password!: string;

  @ApiProperty()
  @Unique()
  @Property({ length: 50, hidden: true })
  email: string;

  @OneToMany(() => Contact, (contact: Contact) => contact.addressBook)
  contacts?: Contact[];
}
