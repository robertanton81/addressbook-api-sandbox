import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/service/users.service';
import { LogInDto } from '../dto/logIn.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterUserResponseDto } from '../dto/register-user-response.dto';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '../config/auth.config';
import { WrongCredentialsException } from '../../common/exceptions/wrong-credentials.exception';
import { User } from '../../users/entities/user.entity';
import TokenPayload from '../interfaces/token-payload.interface';

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
    let user: User;
    try {
      user = await this.usersService.getByEmail(email);
    } catch (e) {
      throw new WrongCredentialsException();
    }
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

  public async getUserFromAuthenticationToken(token: string) {
    const payload: TokenPayload = this.jwtService.verify(token);
    if (payload.email) {
      return await this.usersService.getByEmail(payload.email);
    } else {
      throw new BadRequestException();
    }
  }

  public getJwtAccessToken(email: string) {
    return this.jwtService.sign({ email });
  }
}
