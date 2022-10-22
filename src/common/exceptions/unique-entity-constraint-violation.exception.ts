import { HttpException, HttpStatus } from '@nestjs/common';

export class UniqueEntityConstraintViolation extends HttpException {
  constructor() {
    super(
      "I know that I probably shouldn't tell that user with this email already exists, because you might be performing the enumeration attack. But I want you to know that I know that you know",
      HttpStatus.CONFLICT,
    );
  }
}
