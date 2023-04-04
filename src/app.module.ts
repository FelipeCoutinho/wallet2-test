import { Module } from '@nestjs/common';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [WalletModule, PrismaModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
