import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRepository } from './wallet.repository';
import { PrismaWalletRepository } from './prisma/prisma.wallet.repository';
import { PrismaTransactionRepository } from 'src/transactions/prisma.transaction.repository';
import { TransactionRepository } from 'src/transactions/Transaction.,repository';

@Module({
  controllers: [WalletController],
  providers: [
    WalletService,
    PrismaService,
    {
      provide: WalletRepository,
      useClass: PrismaWalletRepository,
    },
    {
      provide: TransactionRepository,
      useClass: PrismaTransactionRepository,
    },
  ],
})
export class WalletModule {}
