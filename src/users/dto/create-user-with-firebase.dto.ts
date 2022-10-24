import {
  IsEmail,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateFirebaseUserDto } from '../../firebase/dto/create-firebase-user.dto';
import { FirebaseUser } from '../../firebase/entities/firebase-user.entity';

export class CreateUserWithFirebaseDto {
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

  @ApiProperty({ required: false })
  @IsInstance(CreateFirebaseUserDto)
  @IsOptional()
  firebaseUser?: Pick<FirebaseUser, 'firebaseUuid'>;
}
