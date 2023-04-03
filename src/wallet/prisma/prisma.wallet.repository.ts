import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWalletDto } from '../dto/create-wallet.dto';
import { WalletRepository } from '../wallet.repository';

@Injectable()
export class PrismaWalletRepository implements WalletRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(wallet: CreateWalletDto): Promise<any> {
    try {
      await this.prisma.wallet.create({
        data: wallet,
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async findOne(walletId): Promise<any> {
    try {
      return this.prisma.wallet.findFirst({
        where: {
          walletId,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async deposit(walletId: any, amount): Promise<any> {
    try {
      return this.prisma.wallet.update({
        where: {
          walletId,
        },
        data: {
          balance: amount,
        },
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  async withdraw(walletId: number, amount: number): Promise<any> {
    try {
      return this.prisma.wallet.update({
        where: {
          walletId,
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
