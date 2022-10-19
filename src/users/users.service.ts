import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(user: CreateUserDto) {
    const newUser = this.userRepository.create<User>(user);
    await this.userRepository.persistAndFlush(newUser);
    return newUser;
  }
}
