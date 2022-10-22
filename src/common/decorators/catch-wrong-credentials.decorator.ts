import { Catch } from './try-catch-decorator';
import { WrongCredentialsException } from '../exceptions/wrong-credentials.exception';
import { UnauthorizedException } from '@nestjs/common';

export const CatchUnauthorisedException = (): any =>
  Catch(UnauthorizedException, () => {
    throw new WrongCredentialsException();
  });
