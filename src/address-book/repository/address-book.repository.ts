import { BaseRepository } from '../../common/repository/base-repository';
import { AddressBook } from '../entities/address-book.entity';

// we could implement some custom overwrites
export class AddressBookRepository extends BaseRepository<AddressBook> {}
