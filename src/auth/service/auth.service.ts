import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../../users/service/users.service';
import { LogInDto } from '../dto/logIn.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import TokenPayload from '../interfaces/token-payload.interface';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/create-user.dto';
import { User } from '../../users/entities/user.entity';
import { UniqueEntityConstraintViolationExceptionDto } from '../../common/exceptions/dtos/unique-entity-constraint-violation.exception.dto';
import { DatabaseConnectionExceptionDto } from '../../common/exceptions/dtos/database-connection.exception';
import { CatchAll } from '../../common/decorators/try-catch-decorator';
import { RegisterUserResponseDto } from '../dto/register-user-response.dto';
import { ConfigType } from '@nestjs/config';
import { authConfig } from '../auth.config';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    @Inject(authConfig.KEY)
    private authConfigService: ConfigType<typeof authConfig>,
  ) {}

  public async login(loginData: LogInDto) {
    const { email, password } = loginData;
    const user = await this.usersService.getByEmail(email);
    await this.verifyPassword(password, user.password);

    return { accessToken: this.jwtService.sign({ email }) };
  }

  @ApiBody({
    type: CreateUserDto,
    required: true,
    examples: {
      CreateUserDto: {
        summary: 'values for creating user',
        value: {
          email: 'test@email.com',
          password: 'someStrongPassword',
        },
      },
    },
  })
  @ApiCreatedResponse({ description: 'user successfully created', type: User })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'User exists',
    type: UniqueEntityConstraintViolationExceptionDto,
  })
  @ApiBadRequestResponse({ description: 'bad request' })
  @ApiResponse({
    status: HttpStatus.SERVICE_UNAVAILABLE,
    description: 'database connection error',
    type: DatabaseConnectionExceptionDto,
  })
  @CatchAll((err) => {
    throw err;
  })
  public async register(
    registrationData: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    const hashedPassword = await bcrypt.hash(registrationData.password, 10);

    await this.usersService.create({
      ...registrationData,
      password: hashedPassword,
    });

    return {
      accessToken: this.getCookieWithJwtAccessToken(registrationData.email),
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

  private async verifyPassword(
    plainTextPassword: string,
    hashedPassword: string,
  ) {
    const isPasswordMatching = await bcrypt.compare(
      plainTextPassword,
      hashedPassword,
    );
    if (!isPasswordMatching) {
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

  public getCookieWithJwtAccessToken(email: string) {
    const payload: TokenPayload = { email };
    const expiresIn = `${this.authConfigService.JWT_TOKEN_EXPIRES}`;

    const token = this.jwtService.sign(payload);

    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }
}
