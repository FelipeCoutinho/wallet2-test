import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';
import { PaymentService } from './payment/payment.service';

@Module({
  imports: [WalletModule, PrismaModule],
  controllers: [],
  providers: [PaymentService],
})
export class AppModule {}
