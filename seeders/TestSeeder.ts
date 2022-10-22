import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../test/factories/user.factory';

export class TestSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new UserFactory(em).makeOne({
      email: 'e2e_test_2@e2e.com',
    });
  }
}
