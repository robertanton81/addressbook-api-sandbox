import { User } from '../entities/user.entity';
import { BaseRepository } from '../../common/repository/base-repository';

// we could implement some custom overwrites
export class UsersRepository extends BaseRepository<User> {}
