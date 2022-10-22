import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { mockedJwtService } from '../service/jwt.service.mock';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/service/users.service';
import { mockedUserService } from '../../users/service/users.service.mock';

const moduleMocker = new ModuleMocker(global);

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [],
    })
      .useMocker((token) => {
        if (token === JwtService) {
          return mockedJwtService;
        }
        if (token === UsersService) {
          return mockedUserService;
        }

        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);

          return new Mock();
        }
      })
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
