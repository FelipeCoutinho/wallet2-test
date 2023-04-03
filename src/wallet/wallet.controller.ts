import { Controller, Get, Post, Body } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto, paymentDTO } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post()
  creat(@Body() body: CreateWalletDto) {
    try {
      return this.walletService.create(body);
    } catch (error) {
      return error.stack;
    }
  }
  @Post('/deposit')
  async deposit(@Body() body: any) {
    try {
      const { walletId, amount } = body;
      return this.walletService.deposit(walletId, amount);
    } catch (error) {
      return error.stack;
    }
  }

  @Get('/withdraw')
  async withdraw(@Body() body: any) {
    try {
      const { walletId, amount } = body;
      return this.walletService.withdraw(walletId, amount);
    } catch (error) {
      return error.stack;
    }
  }

  @Post('/payment')
  payment(@Body() payment: paymentDTO) {
    try {
      return this.walletService.payment(payment.value);
    } catch (error) {
      return error.stack;
    }
  }

  @Post('chargeback')
  chargeback(@Body() body: paymentDTO) {
    try {
      return this.walletService.chargeback(Number(body.value));
    } catch (error) {
      return error.stack;
    }
  }
}
