import { Test, TestingModule } from '@nestjs/testing';
import { AddressBookService } from './address-book.service';
import { FirebaseService } from '../../firebase/service/firebase.service';
import { firebaseConfig } from '../../firebase/config/firebase.config';
import { UsersService } from '../../users/service/users.service';
import { mockedUserService } from '../../users/service/users.service.mock';
import { setFirebaseMock } from '../../firebase/firebase.mock';

setFirebaseMock();

describe('AddressBookService', () => {
  let service: AddressBookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AddressBookService, FirebaseService],
    })
      .useMocker((token) => {
        if (token === firebaseConfig.KEY) {
          return firebaseConfig;
        }
        if (token === UsersService) {
          return mockedUserService;
        }
      })
      .compile();

    service = module.get<AddressBookService>(AddressBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
