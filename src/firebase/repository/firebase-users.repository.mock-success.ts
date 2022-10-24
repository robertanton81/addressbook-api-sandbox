import { CreateFirebaseUserDto } from '../dto/create-firebase-user.dto';

export const mockedFirebaseUsersRepositorySuccess = {
  persistAndFlush: jest
    .fn()
    .mockImplementation((dto: CreateFirebaseUserDto) => {
      return Promise.resolve({
        ...dto,
      });
    }),
  create: jest.fn().mockImplementation((dto: CreateFirebaseUserDto) => {
    return Promise.resolve({
      ...dto,
    });
  }),
  findOneOrFail: jest.fn().mockImplementation((dto: CreateFirebaseUserDto) => {
    return Promise.resolve({ ...dto });
  }),
};
