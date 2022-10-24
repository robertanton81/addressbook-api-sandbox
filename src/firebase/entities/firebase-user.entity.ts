import {
  Entity,
  EntityRepositoryType,
  OneToOne,
  Property,
  Unique,
} from '@mikro-orm/core';
import { BaseEntity } from '../../common/entities/base.entity';
import { UsersRepository } from '../../users/repository/users.repository';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';

@Entity({ customRepository: () => UsersRepository })
export class FirebaseUser extends BaseEntity {
  [EntityRepositoryType]?: UsersRepository;

  @ApiProperty()
  @Unique()
  @Property({ length: 50, hidden: true })
  firebaseUuid: string;

  @OneToOne({ mappedBy: 'firebaseUser' })
  appUser: User;
}
