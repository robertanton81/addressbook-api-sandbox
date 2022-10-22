import { Factory, Faker } from '@mikro-orm/seeder';
import { User } from '../../src/users/entities/user.entity';

export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    return {
      email: faker.internet.email(),
      password: faker.internet.password(7),
    };
  }
}
