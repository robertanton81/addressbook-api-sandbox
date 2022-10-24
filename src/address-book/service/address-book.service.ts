import { Injectable } from '@nestjs/common';

@Injectable()
export class AddressBookService {
  create() {
    return 'This action adds a new addressBook';
  }

  findAll() {
    return `This action returns all addressBook`;
  }

  findOne(id: number) {
    return `This action returns a #${id} addressBook`;
  }

  remove(id: number) {
    return `This action removes a #${id} addressBook`;
  }
}
