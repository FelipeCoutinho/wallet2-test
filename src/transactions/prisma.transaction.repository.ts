import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionRepository } from './Transaction.,repository';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data): Promise<any> {
    try {
      return this.prisma.transactions.create({
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
