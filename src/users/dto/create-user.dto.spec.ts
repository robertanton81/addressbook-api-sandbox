import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('validate DTO', async () => {
    const target: ValidationPipe = new ValidationPipe({
      transform: true,
      whitelist: true,
    });
    const metadata: ArgumentMetadata = {
      type: 'body',
      metatype: CreateUserDto,
      data: '',
    };

    await target.transform(<CreateUserDto>{}, metadata).catch((err) => {
      expect(err.getResponse().message).toEqual([
        'email should not be empty',
        'email must be an email',
        'password must be longer than or equal to 7 characters',
        'password must be a string',
        'password should not be empty',
      ]);
    });
  });
});
