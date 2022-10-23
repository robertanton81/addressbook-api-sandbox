import { HttpException, HttpStatus } from '@nestjs/common';

export class EntityNotFoundException extends HttpException {
  constructor(err, ctx) {
    super(err.message, HttpStatus.NOT_FOUND);
  }
}
