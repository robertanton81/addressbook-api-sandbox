import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class UniqueEntityConstraintViolationExceptionDto {
  @ApiProperty({ example: HttpStatus.CONFLICT })
  statusCode: number;
  @ApiProperty({
    example:
      "I know that I probably shouldn't tell that user with this email already exists, because you might be performing the enumeration attack. But I want you to know that I know that you know",
  })
  message: string;
}
