import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto, paymentDTO } from './dto/update-wallet.dto';
import { get } from 'http';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly prisma: PrismaService
    ) {}

  @Post('/deposit')
  deposit(@Body() bady: any) {
    return this.walletService.deposit(Number(bady.value));
  }

  @Get('withdraw')
  withdraw(@Body() body: any) {
    return this.walletService.withdraw(Number(body.value));
  }

  @Post('/payment')
  payment(@Body() payment: paymentDTO) {
    return this.walletService.payment(payment.value);
  }

  @Post('chargeback')
  chargeback(@Body() body: paymentDTO) {
    return this.walletService.chargeback(Number(body.value));
  }

  @Get('/user')
  findOne() {
    return this.prisma.user.findFirst( );
  }
}
