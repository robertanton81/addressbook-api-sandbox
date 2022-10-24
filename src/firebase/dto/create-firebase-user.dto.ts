import { IsInstance, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { FirebaseUser } from '../../firebase/entities/firebase-user.entity';

export class CreateFirebaseUserDto {
  @ApiProperty({ required: true })
  @IsInstance(FirebaseUser)
  @IsNotEmpty()
  @IsString()
  firebaseUuid?: FirebaseUser;
}
