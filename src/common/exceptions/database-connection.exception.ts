import { HttpException, HttpStatus } from '@nestjs/common';

export class DatabaseConnectionException extends HttpException {
  constructor() {
    super(
      'I am sorry but database seems to be OOO',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
