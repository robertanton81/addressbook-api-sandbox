import { Entity, PrimaryKey, Property } from '@mikro-orm/core';
import { Exclude } from 'class-transformer';

@Entity({ abstract: true })
export abstract class BaseEntity {
  @PrimaryKey()
  id: number;

  @Exclude()
  @Property({ fieldName: 'createdAt', length: 6 })
  createdAt: Date = new Date();

  @Exclude()
  @Property({ fieldName: 'updatedAt', length: 6, onUpdate: () => new Date() })
  updatedAt: Date = new Date();
}
