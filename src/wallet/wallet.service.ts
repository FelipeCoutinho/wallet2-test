import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { WalletRepository } from './wallet.repository';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';

@Injectable()
export class WalletService {
  constructor(private readonly walletRepository: WalletRepository) {}
  async create(wallet: CreateWalletDto): Promise<any> {
    try {
      return this.walletRepository.create(wallet);
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  remove(id: number) {
    return `This action removes a #${id} wallet`;
  }

  async findOne(walletId): Promise<any> {
    try {
      return this.walletRepository.findOne(walletId);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deposit(walletId: number, amount: number): Promise<any> {
    try {
      const wallet = await this.findOne(walletId);

      wallet.balance += amount;
      const result = await this.walletRepository.deposit(
        walletId,
        wallet.balance,
      );

      return {
        balance: result.balance,
        deposit: amount,
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async withdraw(walletId: number, amount: number): Promise<any> {
    try {
      const wallet = await this.findOne(walletId);

      if (wallet.balance < amount) {
        //TODO: trocao para exeption do proprio nest
        return new BadRequestException(
          'your balance is not enough for  this withdraw',
        );
      }

      wallet.balance -= amount;

      const result = await this.walletRepository.withdraw(
        walletId,
        wallet.balance,
      );

      return {
        balance: result.balance,
        saque: amount,
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  payment(amount: number) {
    return amount;
  }

  chargeback(amount: number) {
    return { ok: true, amount: amount };
  }
}
