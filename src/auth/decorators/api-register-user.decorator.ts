import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { HttpStatus } from '@nestjs/common';
import { UniqueEntityConstraintViolationExceptionDto } from '../../common/exceptions/dtos/unique-entity-constraint-violation.exception.dto';
import { DatabaseConnectionExceptionDto } from '../../common/exceptions/dtos/database-connection.exception';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { registerUserApiBodyExample } from '../api-schemas/examples/register-user-api-body.example';

export const ApiRegisterUser = (): any => {
  return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
    ApiBody({
      type: CreateUserDto,
      required: true,
      examples: registerUserApiBodyExample,
    })(target, propertyKey, descriptor);

    ApiCreatedResponse({
      description: 'user successfully registered',
      type: User,
    })(target, propertyKey, descriptor);

    ApiResponse({
      status: HttpStatus.CONFLICT,
      description: 'User exists',
      type: UniqueEntityConstraintViolationExceptionDto,
    })(target, propertyKey, descriptor);

    ApiBadRequestResponse({ description: 'bad request' });

    ApiResponse({
      status: HttpStatus.SERVICE_UNAVAILABLE,
      description: 'database connection error',
      type: DatabaseConnectionExceptionDto,
    })(target, propertyKey, descriptor);

    return descriptor;
  };
};
