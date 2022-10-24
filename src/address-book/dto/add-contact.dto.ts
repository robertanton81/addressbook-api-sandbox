import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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
    required: true,
    example: '+420 1223 123 123',
  })
  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    required: true,
    example: 'Pařížská 1, Praha 10001',
  })
  @IsString()
  @IsNotEmpty()
  address: string;
}
