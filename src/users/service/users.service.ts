import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repository/users.repository';
import { User } from '../entities/user.entity';
import { CatchNotFoundException } from '../../common/decorators/catch-not-found.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { wrap } from '@mikro-orm/core';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(user: CreateUserDto) {
    const newUser = this.userRepository.create<User>(user);
    await this.userRepository.persistAndFlush(newUser);

    return newUser;
  }

  async updateUserFirebaseId(uid: string, user: User) {
    return this.updateUser({ firebaseUid: uid }, user);
  }

  async updateUser(data: Partial<UpdateUserDto>, user: User) {
    return this.userRepository.update(data, user);
  }

  @CatchNotFoundException()
  async getByEmail(email: string) {
    return this.userRepository.findOneOrFail({ email });
  }
}
