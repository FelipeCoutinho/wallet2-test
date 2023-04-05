import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreditCardRepository } from './creditcard.repository';

@Injectable()
export class PrismaCreditCardRepository implements CreditCardRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data): Promise<any> {
    try {
      return this.prisma.creditcard.create({
        data,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(walletId): Promise<any> {
    try {
      return this.prisma.creditcard.findFirst({
        where: {
          walletId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async payment(credcardId: number, amount: number): Promise<any> {
    try {
      return this.prisma.creditcard.update({
        where: {
          credcardId,
        },
        data: {
          balance: amount,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  chargeback(credcardId: number, amount: number): Promise<any> {
    try {
      return this.prisma.creditcard.update({
        where: {
          credcardId,
        },
        data: {
          balance: amount,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}
