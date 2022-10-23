import { CreateUserDto } from '../dto/create-user.dto';

export const mockedUserService = {
  create: jest.fn().mockImplementation((dto: CreateUserDto) => {
    return Promise.resolve({
      ...dto,
    });
  }),
};
