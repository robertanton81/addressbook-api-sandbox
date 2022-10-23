import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/users.service';
import { mockedJwtService } from './jwt.service.mock';
import { authConfig } from '../config/auth.config';
import { authConfigMock } from '../config/auth.config.mock';
import { functionMocker } from '../../common/mocks/mocker.helper';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { UsersRepository } from '../../users/repository/users.repository';
import { mockedUsersRepositorySuccess } from '../../users/repository/users.repository.mock-success';
import { LogInDto } from '../dto/logIn.dto';
import * as bcrypt from 'bcrypt';
import { WrongCredentialsException } from '../../common/exceptions/wrong-credentials.exception';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return mockedJwtService;
        }

        if (token === UsersRepository) {
          return mockedUsersRepositorySuccess;
        }

        if (token === authConfig.KEY) {
          return authConfigMock;
        }

        if (typeof token === 'function') {
          functionMocker(token);
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when registering user', () => {
    describe('and using valid data', () => {
      it('should return access token', async () => {
        const createUserDto: CreateUserDto = {
          email: 'test@test.com',
          password: 'tes3',
        };
        const createdUser = await service.register(createUserDto);

        expect(createdUser).toMatchObject({
          accessToken: '',
        });
      });
    });
  });

  describe('when signing in an user', () => {
    let bcryptCompare: jest.Mock;
    beforeEach(() => {
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
    });

    describe('and using valid credentials', () => {
      it('should return access token', async () => {
        const createUserDto: LogInDto = {
          email: 'test@test.com',
          password: 'tes3',
        };
        const createdUser = await service.login(createUserDto);

        expect(createdUser).toMatchObject({
          accessToken: '',
        });
      });
    });

    describe('and using incorrect credentials', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw unauthorised error', async () => {
        const createUserDto: LogInDto = {
          email: 'test@test.com',
          password: 'tes3',
        };

        await expect(service.login(createUserDto)).rejects.toThrow(
          WrongCredentialsException,
        );
      });
    });
  });

  describe('when authenticating an user', () => {
    let bcryptCompare: jest.Mock;
    beforeEach(() => {
      bcryptCompare = jest.fn().mockReturnValue(true);
      (bcrypt.compare as jest.Mock) = bcryptCompare;
    });

    describe('and using valid credentials', () => {
      it('should return access token', async () => {
        const logInDto: LogInDto = {
          email: 'test@test.com',
          password: 'tes3',
        };
        const authUser = await service.login(logInDto);

        expect(authUser).toMatchObject(authUser);
      });
    });

    describe('and using incorrect credentials', () => {
      beforeEach(() => {
        bcryptCompare.mockReturnValue(false);
      });

      it('should throw unauthorised error', async () => {
        const createUserDto: LogInDto = {
          email: 'test@test.com',
          password: 'tes3',
        };

        await expect(service.login(createUserDto)).rejects.toThrow(
          WrongCredentialsException,
        );
      });
    });
  });
});
