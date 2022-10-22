import { HttpException, HttpStatus } from '@nestjs/common';

export class DataBaseConnectionException extends HttpException {
  constructor() {
    super(
      'I am sorry but database seems to be OOO',
      HttpStatus.SERVICE_UNAVAILABLE,
    );
  }
}
