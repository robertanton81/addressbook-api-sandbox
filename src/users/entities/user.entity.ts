import {
  Entity,
  EntityRepositoryType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { UsersRepository } from '../users.repository';

@Entity({ customRepository: () => UsersRepository, tableName: 'AppUsers' })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UsersRepository;

  @Property({ length: 255, hidden: true })
  password!: string;

  @Unique()
  @Property({ length: 50 })
  email: string;
}
