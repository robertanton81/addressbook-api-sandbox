import { registerAs } from '@nestjs/config';

export const authConfigMock = registerAs('auth', () => ({
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_TOKEN_EXPIRES: process.env.JWT_TOKEN_EXPIRES,
}));
