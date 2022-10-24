import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { mockedJwtService } from '../service/jwt.service.mock';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/users.service';
import { mockedUserService } from '../../users/service/users.service.mock';
import { functionMocker } from '../../common/mocks/mocker.helper';
import { authConfig } from '../config/auth.config';
import { authConfigMock } from '../config/auth.config.mock';
import { AuthService } from '../service/auth.service';
import { FirebaseService } from '../../firebase/service/firebase.service';
import { mockedFirebaseServiceSuccess } from '../../firebase/service/firebase.service.mock-success';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return mockedJwtService;
        }

        if (token === UsersService) {
          return mockedUserService;
        }

        if (token === FirebaseService) {
          return mockedFirebaseServiceSuccess;
        }

        if (token === authConfig.KEY) {
          return authConfigMock;
        }

        if (typeof token === 'function') {
          functionMocker(token);
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
