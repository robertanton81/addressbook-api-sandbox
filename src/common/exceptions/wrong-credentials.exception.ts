import { HttpException, HttpStatus } from '@nestjs/common';

export class WrongCredentialsException extends HttpException {
  constructor() {
    super("Sorry, can't let you in. ", HttpStatus.UNAUTHORIZED);
  }
}
