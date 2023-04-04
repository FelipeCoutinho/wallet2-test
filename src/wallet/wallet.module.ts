import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { WalletRepository } from './wallet.repository';
import { PrismaWalletRepository } from './prisma/prisma.wallet.repository';
import { PrismaTransactionRepository } from 'src/transactions/prisma.transaction.repository';
import { TransactionRepository } from 'src/transactions/Transaction.repository';
import { CreditCardRepository } from 'src/creditcard/creditcard.repository';
import { PrismaCreditCardRepository } from 'src/creditcard/prisma.creditcard.repository';

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
    {
      provide: CreditCardRepository,
      useClass: PrismaCreditCardRepository,
    },
  ],
})
export class WalletModule {}
