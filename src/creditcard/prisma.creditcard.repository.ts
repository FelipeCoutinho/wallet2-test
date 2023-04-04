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
}
