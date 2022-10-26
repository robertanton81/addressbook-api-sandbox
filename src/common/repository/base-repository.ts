import { wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { CatchUniqueConstraintViolation } from '../decorators/catch-unique-constraint-violation.decorator';

export class BaseRepository<T> extends EntityRepository<T> {
  // one way of catching errors through decorators
  // extracted to base repository so every new entities does not have to implement this error handling
  @CatchUniqueConstraintViolation()
  persistAndFlush(entity: T | T[]): Promise<void> {
    return super.persistAndFlush(entity);
  }

  update(data: Record<string, any>, entity: T) {
    wrap(entity).assign(data);
    return super.flush();
  }
}
