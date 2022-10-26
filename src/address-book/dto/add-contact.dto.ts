import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AddContactDto {
  @ApiProperty({
    required: true,
    example: 'Jon',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    required: true,
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    required: false,
    example: '+420 1223 123 123',
  })
  @IsString()
  phoneNumber?: string;

  @ApiProperty({
    required: false,
    example: 'Pařížská 1, Praha 10001',
  })
  @IsString()
  address?: string;

  @ApiProperty({
    required: true,
    format: '<local-part>@<domain>',
    example: 'strv_test_user.bob@mailinator@com',
  })
  @IsEmail()
  @IsString()
  email: string;
}
