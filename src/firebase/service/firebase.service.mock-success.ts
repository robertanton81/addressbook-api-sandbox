import { CreateFirebaseUserDto } from '../dto/create-firebase-user.dto';

export const mockedFirebaseServiceSuccess = {
  createFirebaseUser: jest
    .fn()
    .mockImplementation((dto: CreateFirebaseUserDto) => {
      return Promise.resolve({
        ...dto,
      });
    }),
};
