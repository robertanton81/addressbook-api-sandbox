import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserRepository;

  beforeEach(async () => {
    mockUserRepository = {
      persistAndFlush: jest.fn().mockImplementation((dto: CreateUserDto) => {
        return Promise.resolve({
          ...dto,
        });
      }),
      create: jest.fn().mockImplementation((dto: CreateUserDto) => {
        return Promise.resolve({
          ...dto,
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

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
