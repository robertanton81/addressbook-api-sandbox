import {
  BadRequestException,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../../users/service/users.service';
import { AuthService } from '../service/auth.service';
import { ExtractJwt } from 'passport-jwt';
import TokenPayload from '../interfaces/token-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  use(req, res, next: () => void) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(req as any);
    if (token) {
      const payload: TokenPayload = this.jwtService.verify(token);
      if (payload.email) {
        this.usersService
          .getByEmail(payload.email)
          .then((user) => {
            req.currentUser = user;
          })
          .catch((e) => {
            throw e;
          });
      } else {
        throw new BadRequestException();
      }
      next();
    } else {
      throw new UnauthorizedException();
    }
  }
}
