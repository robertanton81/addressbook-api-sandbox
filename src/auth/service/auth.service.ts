import { Inject, Injectable } from '@nestjs/common';
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
import { FirebaseService } from '../../firebase/service/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly firebaseService: FirebaseService,
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

    const fireBAseUser = await this.firebaseService.createFirebaseUser(
      registrationData,
    );

    if (fireBAseUser.uid) {
      // todo: need to create user in transaction and persist only when firebase succeeds
      const userInstance = await this.usersService.create({
        ...registrationData,
        password: hashedPassword,
        firebaseUser: {
          firebaseUuid: fireBAseUser.uid,
        },
      });
    }

    return {
      accessToken: this.getJwtAccessToken(registrationData.email),
    };
  }

  public getJwtAccessToken(email: string) {
    return this.jwtService.sign({ email });
  }
}
