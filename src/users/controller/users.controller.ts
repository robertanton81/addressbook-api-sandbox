import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { Catch } from '../../common/decorators/try-catch-decorator';
import { UniqueEntityConstraintViolation } from '../../common/exceptions/UniqueEntityConstraintViolation.exception';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Catch(UniqueConstraintViolationException, () => {
    throw new UniqueEntityConstraintViolation();
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
