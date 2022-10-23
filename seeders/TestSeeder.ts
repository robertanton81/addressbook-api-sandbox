import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { UserFactory } from '../test/factories/user.factory';
import * as bcrypt from 'bcrypt';

export class TestSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const hashedPassword = await bcrypt.hash('e2e_strong_password', 10);

    new UserFactory(em).makeOne({
      email: 'e2e_test_2@e2e.com',
      password: hashedPassword,
    });
  }
}
