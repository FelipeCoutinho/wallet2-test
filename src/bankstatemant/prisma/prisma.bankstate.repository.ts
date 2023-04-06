import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BankstatementRepository } from './bankstate.repository';

@Injectable()
export class PrismaBankstateRepository implements BankstatementRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findMany(walletId): Promise<any> {
    try {
      return this.prisma.transactions.findMany({
        where: {
          walletId,
        },
        include: {
          wallat: {
            select: {
              transactions: true,
            },
          },
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
