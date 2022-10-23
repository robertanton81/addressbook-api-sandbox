import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../entities/user.entity';
import { CatchNotFoundException } from '../../common/decorators/catch-not-found.decorator';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(user: CreateUserDto, flush: boolean) {
    const newUser = this.userRepository.create<User>(user);
    if (flush) {
      await this.userRepository.persistAndFlush(newUser);
    }
    return newUser;
  }

  async persist(user: User) {
    return this.userRepository.persistAndFlush(user);
  }

  @CatchNotFoundException()
  async getByEmail(email: string) {
    return this.userRepository.findOneOrFail({ email });
  }
}
