import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { WalletModule } from './wallet/wallet.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [WalletModule,PrismaModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
