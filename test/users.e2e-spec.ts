import { MikroORM } from '@mikro-orm/core';
import { HttpStatus } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { TestSeeder } from '../seeders/TestSeeder';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';

describe('Users controller (e2e)', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    await app.init();

    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getSchemaGenerator().updateSchema();
    await app.get(MikroORM).getSeeder().seed(TestSeeder);
  });

  describe('creating a user', () => {
    describe('and using valid data', () => {
      it(`should succeed with unique login detail`, () => {
        const createUserDto: CreateUserDto = {
          email: 'e2e_test@e2e.com',
          password: 'e2e_password',
        };

        return app
          .inject({ method: 'POST', url: '/users', payload: createUserDto })
          .then((res) => {
            return expect(res.statusCode).toBe(201);
          });
      });

      it(`should fail due to unique constraint validation`, () => {
        const createUserDto: CreateUserDto = {
          email: 'e2e_test_2@e2e.com',
          password: 'e2e_password',
        };

        return app
          .inject({ method: 'POST', url: '/users', payload: createUserDto })
          .then((res) => {
            return expect(res.statusCode).toBe(HttpStatus.CONFLICT);
          });
      });
    });
  });

  afterAll(async () => {
    await app.get(MikroORM).getSchemaGenerator().clearDatabase();
    await app.close();
  });
});
