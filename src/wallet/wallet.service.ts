import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './wallet.repository';
import { typePaymentEnum } from './enum/payment.enum';
import { operationEnum } from './enum/payment.enum';

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

  async payment(
    walletId: number,
    amount: number,
    typePaymentparam: number,
  ): Promise<any> {
    try {
      const wallet = await this.findOne(walletId);

      switch (typePaymentparam) {
        case typePaymentEnum.BALANCE:
          return this.paymentBalance(wallet, amount, walletId);

        default:
          return this.paymentBalance(wallet, amount, walletId);
      }
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async paymentBalance(
    wallet: CreateWalletDto,
    amount: number,
    walletId: number,
  ) {
    try {
      if (wallet.balance < amount) {
        return new BadRequestException(
          'your balance is not enough for  this payment',
        );
      }

      wallet.balance -= amount;

      const result = await this.walletRepository.payment(
        walletId,
        wallet.balance,
      );

      return {
        balance: result.balance,
        payment: amount,
        paymentMethod: 'balance',
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async chargeback(
    walletId: number,
    amount: number,
    typePaymentparam: number,
  ): Promise<any> {
    try {
      const wallet = await this.findOne(walletId);

      switch (typePaymentparam) {
        case typePaymentEnum.BALANCE:
          return this.chargebackBalance(wallet, amount, walletId);
        default:
          return this.chargebackBalance(wallet, amount, walletId);
      }
    } catch (error) {
      throw InternalServerErrorException;
    }
  }

  async chargebackBalance(
    wallet: CreateWalletDto,
    amount: number,
    walletId: number,
  ) {
    try {
      wallet.balance += amount;

      const result = await this.walletRepository.payment(
        walletId,
        wallet.balance,
      );

      return {
        balance: result.balance,
        chargeback: amount,
        paymentMethod: 'balance',
      };
    } catch (error) {
      throw InternalServerErrorException;
    }
  }
}
