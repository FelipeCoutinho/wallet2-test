import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BankstatemantService } from './bankstatemant.service';
import { CreateBankstatemantDto } from './dto/create-bankstatemant.dto';
import { UpdateBankstatemantDto } from './dto/update-bankstatemant.dto';

@Controller('bankstatemant')
export class BankstatemantController {
  constructor(private readonly bankstatemantService: BankstatemantService) {}

  @Get(':id')
  //TODO PEGAR POR USER
  findOne(@Param('id') id: number) {
    return this.bankstatemantService.findOne(Number(id));
  }
}
