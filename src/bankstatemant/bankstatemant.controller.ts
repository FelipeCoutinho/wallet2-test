import { Controller, Get, Param } from '@nestjs/common';
import { BankstatemantService } from './bankstatemant.service';
@Controller('bankstatemant')
export class BankstatemantController {
  constructor(private readonly bankstatemantService: BankstatemantService) {}

  @Get(':id')
  //TODO PEGAR POR USER
  findOne(@Param('id') id: number) {
    return this.bankstatemantService.findOne(Number(id));
  }
}
