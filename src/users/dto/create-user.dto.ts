import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  minLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    required: true,
    format: '<local-part>@<domain>',
    example: 'strv_test_user.bob@mailinator@com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    required: true,
    minLength: 7,
    example: 'veryveryverystrongpassword',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(7)
  password: string;
}
