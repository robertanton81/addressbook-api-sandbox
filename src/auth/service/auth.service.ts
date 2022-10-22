import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/service/users.service';
import { LogInDto } from '../dto/logIn.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import TokenPayload from '../interfaces/token-payload.interface';
import { RegisterUserResponseDto } from '../dto/register-user-response.dto';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '../auth.config';
import { WrongCredentialsException } from '../../common/exceptions/wrong-credentials.exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(authConfig.KEY)
    private authConfigService: ConfigType<typeof authConfig>,
  ) {}

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
      throw new WrongCredentialsException();
    }
  }

  public async login(loginData: LogInDto) {
    const { email, password } = loginData;
    const user = await this.usersService.getByEmail(email);
    await this.verifyPassword(password, user.password);

    return { accessToken: this.jwtService.sign({ email }) };
  }

  public async register(
    registrationData: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    await this.usersService.create({
      ...registrationData,
      password: hashedPassword,
    });

    return {
      accessToken: this.getJwtAccessToken(registrationData.email),
    };
  }

  public async getAuthenticatedUser(email: string, plainTextPassword: string) {
    try {
      const user = await this.usersService.getByEmail(email);
      await this.verifyPassword(plainTextPassword, user.password);

      return user;
    } catch (error) {
      throw new HttpException(
        'Wrong credentials provided',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token);
    if (payload.email) {
      return this.usersService.getByEmail(payload.email);
    }
  }

  public getJwtAccessToken(email: string) {
    return this.jwtService.sign({ email });
  }
}
