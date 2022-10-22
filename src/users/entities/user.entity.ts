import {
  Entity,
  EntityRepositoryType,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { UsersRepository } from '../repository/users.repository';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ customRepository: () => UsersRepository })
export class User extends BaseEntity {
  [EntityRepositoryType]?: UsersRepository;

  @ApiProperty()
  @Property({ length: 255, hidden: true })
  password!: string;

  @ApiProperty()
  @Unique()
  @Property({ length: 50, hidden: true })
  email: string;
}
