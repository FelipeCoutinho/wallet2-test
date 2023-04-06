import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankstatementRepository } from './bankstate.repository';

@Injectable()
export class PrismaBankstateRepository implements BankstatementRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(walletId): Promise<any> {
    try {
      return this.prisma.wallet.findMany({
        where: {
          walletId,
        },
        include: {
          User: true,
          creditcard: true,
          transactions: true,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
