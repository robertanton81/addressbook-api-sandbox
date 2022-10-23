import { CreateUserDto } from '../dto/create-user.dto';
import { LogInDto } from '../../auth/dto/logIn.dto';

export const mockedUsersRepositorySuccess = {
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
  findOneOrFail: jest.fn().mockImplementation((dto: LogInDto) => {
    return Promise.resolve({ ...dto });
  }),
};
