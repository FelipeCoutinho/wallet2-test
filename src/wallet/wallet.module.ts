import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRepository } from './wallet.repository';
import { PrismaWalletRepository } from './prisma.wallet.repository';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    PrismaService,
    {
      provide: WalletRepository,
      useClass: PrismaWalletRepository,
    },
  ],
})
export class WalletModule {}
