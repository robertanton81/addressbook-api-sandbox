import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AddressBookService } from '../service/address-book.service';
import JwtAuthenticationGuard from '../../auth/guards/jwt-auth.guard';
import { ExtractJwt } from 'passport-jwt';
import { IRequestWithUser } from '../../auth/interfaces/request.interface';
import { AuthService } from '../../auth/service/auth.service';

@Controller('address-book')
export class AddressBookController {
  constructor(
    private readonly addressBookService: AddressBookService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async addContact(@Req() request: IRequestWithUser) {
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request as any);
    const user = await this.authService.getUserFromAuthenticationToken(token);

    this.addressBookService.addContact(user);
  }
}
