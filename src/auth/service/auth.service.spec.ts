import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { mockedUserService } from '../../users/service/users.service.mock';
import { setMocker } from '../../common/utils/mocker.utils';
import { UsersService } from '../../users/service/users.service';
import { mockedJwtService } from './jwt.service.mock';
import { authConfig } from '../auth.config';
import { authConfigMock } from '../auth.config.mock';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return mockedJwtService;
        }

        if (token === UsersService) {
          return mockedUserService;
        }

        if (token === authConfig.KEY) {
          return authConfigMock;
        }
        if (typeof token === 'function') {
          return setMocker(token);
        }
      })
      .compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
