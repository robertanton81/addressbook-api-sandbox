import { Catch } from './try-catch-decorator';
import { EntityNotFoundException } from '../exceptions/not-found.exception';
import { NotFoundError } from '@mikro-orm/core';

export const CatchNotFoundException = (): any =>
  Catch(NotFoundError, (error, ctx) => {
    throw new EntityNotFoundException(error, ctx);
  });
