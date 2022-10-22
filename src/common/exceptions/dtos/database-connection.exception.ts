import { ApiProperty } from '@nestjs/swagger';
import { HttpStatus } from '@nestjs/common';

export class DatabaseConnectionExceptionDto {
  @ApiProperty({ example: HttpStatus.SERVICE_UNAVAILABLE })
  statusCode: number;

  @ApiProperty({
    example: {
      statusCode: 503,
      message: 'I am sorry but database seems to be OOO',
    },
  })
  message: string;
}
