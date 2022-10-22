import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from '../repository/users.repository';
import { CreateUserDto } from '../dto/create-user.dto';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { usersRepositoryMock } from '../repository/users.repository.mock';
import { functionMocker } from '../../common/mocks/mocker.helper';

const moduleMocker = new ModuleMocker(global);

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    })
      .useMocker((token) => {
        if (token === UsersRepository) {
          return usersRepositoryMock;
        }

        if (typeof token === 'function') {
          functionMocker(token);
        }
      })
      .compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const createUserDto: CreateUserDto = {
      email: 'test@test.com',
      password: 'tes3',
    };
    const createdUser = await service.create(createUserDto);

    expect(createdUser).toMatchObject(createUserDto);
  });
});
