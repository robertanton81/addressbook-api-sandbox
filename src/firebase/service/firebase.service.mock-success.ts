import { CreateUserDto } from '../../users/dto/create-user.dto';

export const mockedFirebaseServiceSuccess = {
  createFirebaseUser: jest.fn().mockImplementation((dto: CreateUserDto) => {
    return Promise.resolve({
      ...dto,
    });
  }),
};
