import { Test, TestingModule } from '@nestjs/testing';
import { AddressBookService } from './address-book.service';
import { FirebaseService } from '../../firebase/service/firebase.service';
import { firebaseConfig } from '../../firebase/config/firebase.config';
import { FirebaseUsersRepository } from '../../firebase/repository/firebase-users.repository';
import { mockedFirebaseUsersRepositorySuccess } from '../../firebase/repository/firebase-users.repository.mock-success';

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

        if (token === FirebaseUsersRepository) {
          return mockedFirebaseUsersRepositorySuccess;
        }
      })
      .compile();

    service = module.get<AddressBookService>(AddressBookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
