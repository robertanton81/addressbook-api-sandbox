import { MikroORM } from '@mikro-orm/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { Test } from '@nestjs/testing';
import { TestSeeder } from '../seeders/TestSeeder';
import { AppModule } from '../src/app.module';
import { CreateUserDto } from '../src/users/dto/create-user.dto';
import { LogInDto } from '../src/auth/dto/logIn.dto';

describe('Auth controller (e2e)', () => {
  let app: NestFastifyApplication;
  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = module.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(),
    );

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    await app.init();

    await app.get(MikroORM).getSchemaGenerator().ensureDatabase();
    await app.get(MikroORM).getSchemaGenerator().updateSchema();
    await app.get(MikroORM).getSchemaGenerator().clearDatabase();
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
          .inject({
            method: 'POST',
            url: '/auth/register',
            payload: createUserDto,
          })
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
          .inject({
            method: 'POST',
            url: '/auth/register',
            payload: createUserDto,
          })
          .then((res) => {
            return expect(res.statusCode).toBe(HttpStatus.CONFLICT);
          });
      });
    });

    describe('and using invalid data', () => {
      it(`should fail due to wrong email format`, () => {
        const createUserDto: CreateUserDto = {
          email: 'e2e_test_2e2e.com',
          password: 'e2e_password',
        };

        return app
          .inject({
            method: 'POST',
            url: '/auth/register',
            payload: createUserDto,
          })
          .then((res) => {
            expect(JSON.parse(res.body).message[0]).toBe(
              'email must be an email',
            );
            return expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
          });
      });

      it(`should fail due to short password`, () => {
        const createUserDto: CreateUserDto = {
          email: 'e2e_test_@2e2e.com',
          password: 'e2e',
        };

        return app
          .inject({
            method: 'POST',
            url: '/auth/register',
            payload: createUserDto,
          })
          .then((res) => {
            expect(JSON.parse(res.body).message[0]).toBe(
              'password must be longer than or equal to 7 characters',
            );
            return expect(res.statusCode).toBe(HttpStatus.BAD_REQUEST);
          });
      });
    });
  });

  describe('login in a user', () => {
    describe('and using valid payload', () => {
      it(`should succeed with valid credentials`, () => {
        const loginUserDto: LogInDto = {
          email: 'e2e_test_2@e2e.com',
          password: 'e2e_strong_password',
        };

        return app
          .inject({
            method: 'POST',
            url: '/auth/login',
            payload: loginUserDto,
          })
          .then((res) => {
            return expect(JSON.parse(res.body)).toHaveProperty('accessToken');
          });
      });

      it(`should fail due to wrong password`, () => {
        const createUserDto: CreateUserDto = {
          email: 'e2e_test_2@e2e.com',
          password: 'e2e_passwrd',
        };

        return app
          .inject({
            method: 'POST',
            url: '/auth/login',
            payload: createUserDto,
          })
          .then((res) => {
            return expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          });
      });

      it(`should fail due to non existing user`, () => {
        const createUserDto: CreateUserDto = {
          email: 'e@e2e.com',
          password: 'e2e_passwrd',
        };

        return app
          .inject({
            method: 'POST',
            url: '/auth/login',
            payload: createUserDto,
          })
          .then((res) => {
            expect(JSON.parse(res.body));
            return expect(res.statusCode).toBe(HttpStatus.UNAUTHORIZED);
          });
      });
    });
  });

  afterAll(async () => {
    await app.close();
  });
});
