import { Catch } from './try-catch-decorator';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { UniqueEntityConstraintViolation } from '../exceptions/UniqueEntityConstraintViolation.exception';

export const CatchUniqueConstraintViolation = (): any =>
  Catch(UniqueConstraintViolationException, () => {
    throw new UniqueEntityConstraintViolation();
  });
