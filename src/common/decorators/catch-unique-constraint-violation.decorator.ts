import { Catch } from './try-catch-decorator';
import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { UniqueEntityConstraintViolation } from '../exceptions/unique-entity-constraint-violation.exception';

export const CatchUniqueConstraintViolation = (): any =>
  Catch(UniqueConstraintViolationException, () => {
    throw new UniqueEntityConstraintViolation();
  });
