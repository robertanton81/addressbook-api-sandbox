import { Test, TestingModule } from '@nestjs/testing';
import { AddressBookController } from './address-book.controller';
import { AddressBookService } from '../service/address-book.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../auth/service/jwt.service.mock';
import { FirebaseService } from '../../firebase/service/firebase.service';
import { mockedFirebaseServiceSuccess } from '../../firebase/service/firebase.service.mock-success';
import { authConfig } from '../../auth/config/auth.config';
import { authConfigMock } from '../../auth/config/auth.config.mock';
import { functionMocker } from '../../common/mocks/mocker.helper';
import { AuthService } from '../../auth/service/auth.service';
import { firebaseConfig } from '../../firebase/config/firebase.config';
import { UsersService } from '../../users/service/users.service';
import { mockedUserService } from '../../users/service/users.service.mock';

describe('AddressBookController', () => {
  let controller: AddressBookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AddressBookController],
      providers: [AddressBookService, AuthService],
    })
      .useMocker((token) => {
        if (token === FirebaseService) {
          return mockedFirebaseServiceSuccess;
        }

        if (token === JwtService) {
          return mockedJwtService;
        }

        if (token === FirebaseService) {
          return mockedFirebaseServiceSuccess;
        }

        if (token === UsersService) {
          return mockedUserService;
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

    controller = module.get<AddressBookController>(AddressBookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
