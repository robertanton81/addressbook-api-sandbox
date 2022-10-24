import { Controller, Get, Param, Post } from '@nestjs/common';
import { AddressBookService } from '../service/address-book.service';

@Controller('address-book')
export class AddressBookController {
  constructor(private readonly addressBookService: AddressBookService) {}
}
