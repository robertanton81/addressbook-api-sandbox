import { FirebaseUser } from '../entities/firebase-user.entity';
import { BaseRepository } from '../../common/repository/base-repository';

// we could implement some custom overwrites
export class FirebaseUsersRepository extends BaseRepository<FirebaseUser> {}
