import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LogInDto } from '../dto/logIn.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import JwtAuthenticationGuard from '../guards/jwt-auth.guard';
import { RegisterUserResponseDto } from '../dto/register-user-response.dto';
import { ApiBody } from '@nestjs/swagger';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('register')
  async register(
    @Body() registrationData: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    return this.authenticationService.register(registrationData);
  }

  @HttpCode(200)
  @Post('token')
  @ApiBody({ type: LogInDto })
  async logIn(@Body() loginData: LogInDto) {
    return this.authenticationService.login(loginData);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  authenticate(@Req() request, @Res() reply) {
    const { user } = request;
    const cookie = this.authenticationService.getCookieWithJwtAccessToken(
      user.email,
    );
    reply.header('Set-Cookie', [cookie]);
  }
}
