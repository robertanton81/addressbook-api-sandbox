import { Controller } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
