import { BaseRepository } from '../../common/repository/base-repository';
import { Contact } from '../entities/contact.entity';

// we could implement some custom overwrites
export class ContactsRepository extends BaseRepository<Contact> {}
