import { CreateUserDto } from '../dto/create-user.dto';

export const mockedUsersRepositoryFail = {
  persistAndFlush: jest.fn().mockImplementation((dto: CreateUserDto) => {
    return Promise.reject('null');
  }),
  create: jest.fn().mockImplementation((dto: CreateUserDto) => {
    return Promise.resolve({
      ...dto,
    });
  }),
};
