import { CreateUserDto } from '../dto/create-user.dto';

export const usersRepositoryMock = {
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
