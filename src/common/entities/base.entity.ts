import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Property({ fieldName: 'createdAt', length: 6 })
  createdAt: Date = new Date();

  @Property({ fieldName: 'updatedAt', length: 6, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
