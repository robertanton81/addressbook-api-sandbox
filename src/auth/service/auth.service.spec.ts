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
import { firebaseConfig } from '../../firebase/config/firebase.config';
import { FirebaseService } from '../../firebase/service/firebase.service';
import { FirebaseUsersRepository } from '../../firebase/repository/firebase-users.repository';
import * as firebaseAdmin from 'firebase-admin';

jest.mock('bcrypt');
jest.mock('firebase-admin', () => {
  return {
    auth: jest.fn().mockReturnValue({
      createUser: jest.fn(),
    }),
    credential: {
      cert: jest.fn(),
    },
    initializeApp: jest.fn(),
    firestore: jest.fn(),
  };
});

describe('AuthService', () => {
  let service: AuthService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersService, FirebaseService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return mockedJwtService;
        }

        if (token === UsersRepository) {
          return mockedUsersRepositorySuccess;
        }

        if (token === FirebaseUsersRepository) {
          return mockedUsersRepositorySuccess;
        }

        if (token === authConfig.KEY) {
          return authConfigMock;
        }

        if (token === firebaseConfig.KEY) {
          return firebaseConfig;
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
    let firebaseCreateUser: jest.SpyInstance;

    describe('and using valid data', () => {
      beforeAll(() => {
        firebaseCreateUser = jest
          .spyOn(firebaseAdmin.auth(), 'createUser')
          .mockResolvedValue({ uuid: 'test_firebase' } as any);
      });

      afterAll(() => {
        firebaseCreateUser.mockRestore();
      });

      it('should return access token', async () => {
        const createUserDto: CreateUserDto = {
          email: 'test@test.com',
          password: 'tes3asdfsdf',
        };
        const createdUser = await service.register(createUserDto);

        expect(createdUser).toMatchObject({
          accessToken: '',
        });
      });
    });
  });

  describe('when signing in an user', () => {
    describe('and using valid credentials', () => {
      let bcryptCompare: jest.SpyInstance;

      beforeEach(() => {
        bcryptCompare = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => true);
      });

      afterAll(() => {
        bcryptCompare.mockRestore();
      });

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
      let bcryptCompare: jest.SpyInstance;

      beforeEach(() => {
        bcryptCompare = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => false);
      });

      afterAll(() => {
        bcryptCompare.mockRestore();
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
    describe('and using valid credentials', () => {
      let bcryptCompare: jest.SpyInstance;

      beforeAll(() => {
        bcryptCompare = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => true);
      });

      afterAll(() => {
        bcryptCompare.mockRestore();
      });

      it('should return access token', async () => {
        const logInDto: LogInDto = {
          email: 'test@test.com',
          password: 'tes3',
        };
        const authUser = await service.login(logInDto);

        expect(authUser).toMatchObject({ accessToken: '' });
      });
    });

    describe('and using incorrect credentials', () => {
      let bcryptCompare: jest.SpyInstance;

      beforeAll(() => {
        bcryptCompare = jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => false);
      });

      afterAll(() => {
        bcryptCompare.mockRestore();
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
