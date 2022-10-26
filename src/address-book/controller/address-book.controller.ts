import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AddressBookService } from '../service/address-book.service';
import JwtAuthenticationGuard from '../../auth/guards/jwt-auth.guard';
import { IRequestWithUser } from '../../auth/interfaces/request.interface';
import { AuthService } from '../../auth/service/auth.service';
import { ExtractJwt } from 'passport-jwt';
import { AddContactDto } from '../dto/add-contact.dto';
import { CatchAll } from '../../common/decorators/try-catch-decorator';

@Controller('address-book')
export class AddressBookController {
  constructor(
    private readonly addressBookService: AddressBookService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  @CatchAll((err) => {
    throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
  })
  async addContact(
    @Req() request: IRequestWithUser,
    @Body() contactData: AddContactDto,
  ) {
    // FIXME: this whole logic should be in middleware, but it is failing due to fastify adapter error
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request as any);
    const usr = await this.authService.getUserFromAuthenticationToken(token);

    return this.addressBookService.addContact(usr, contactData);
  }
}
