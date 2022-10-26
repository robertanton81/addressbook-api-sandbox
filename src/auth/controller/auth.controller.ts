import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { LogInDto } from '../dto/logIn.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import { RegisterUserResponseDto } from '../dto/register-user-response.dto';
import { ApiBody } from '@nestjs/swagger';
import { CatchUnauthorisedException } from '../../common/decorators/catch-wrong-credentials.decorator';
import { CatchAll } from '../../common/decorators/try-catch-decorator';
import { ApiRegisterUser } from '../decorators/api-register-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authenticationService: AuthService) {}

  @Post('register')
  @ApiRegisterUser()
  @CatchAll((err) => {
    throw err;
  })
  async register(
    @Body() registrationData: RegisterUserDto,
  ): Promise<RegisterUserResponseDto> {
    return this.authenticationService.register(registrationData);
  }

  @Post('login')
  @CatchUnauthorisedException()
  @ApiBody({ type: LogInDto })
  async logIn(@Body() loginData: LogInDto) {
    return this.authenticationService.login(loginData);
  }
}
