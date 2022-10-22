import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { UsersService } from '../service/users.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { CatchUniqueConstraintViolation } from '../../common/decorators/catch-unique-constraint-violation.decorator';
import { CatchAll } from '../../common/decorators/try-catch-decorator';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from '../entities/user.entity';
import { UniqueEntityConstraintViolationExceptionDto } from '../../common/exceptions/dtos/unique-entity-constraint-violation.exception.dto';
import { DatabaseConnectionExceptionDto } from '../../common/exceptions/dtos/database-connection.exception';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBody({
    type: CreateUserDto,
    required: true,
    examples: {
      CreateUserDto: {
        summary: 'values for creating user',
        value: {
          email: 'test@email.com',
          password: 'someStrongPassword',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'user successfully created', type: User })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User exists',
    type: UniqueEntityConstraintViolationExceptionDto,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'database connection error',
    type: DatabaseConnectionExceptionDto,
  })
  @CatchAll((err) => {
    throw err;
  })
  @CatchUniqueConstraintViolation()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
