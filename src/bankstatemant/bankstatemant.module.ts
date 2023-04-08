import { Module } from '@nestjs/common';
import { BankstatemantService } from './bankstatemant.service';
import { BankstatemantController } from './bankstatemant.controller';
import { BankstatementRepository } from './prisma/bankstate.repository';
import { PrismaBankstateRepository } from './prisma/prisma.bankstate.repository';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BankstatemantController],
  providers: [
    BankstatemantService,
    {
      provide: BankstatementRepository,
      useClass: PrismaBankstateRepository,
    },
    PrismaService,
  ],
})
export class BankstatemantModule {}
