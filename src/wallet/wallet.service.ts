import { Injectable } from '@nestjs/common';
import { InternalServerErrorException } from '@nestjs/common/exceptions';
import { BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './wallet.repository';
import { typePaymentEnum } from './enum/payment.enum';
import { operationEnum } from './enum/payment.enum';
import { TransactionRepository } from 'src/transactions/Transaction.,repository';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
  ) {}
  async create(wallet: CreateWalletDto): Promise<any> {
    try {
      return this.walletRepository.create(wallet);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async findOne(walletId): Promise<any> {
    try {
      return this.walletRepository.findOne(walletId);
    } catch (error) {
      return new BadRequestException(error);
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

      const transaction = await this.transaction(
        walletId,
        amount,
        operationEnum.DEPOSIT,
      );

      return {
        balance: result.balance,
        deposit: amount,
        transaction: transaction,
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async withdraw(walletId: number, amount: number): Promise<any> {
    try {
      const wallet = await this.findOne(walletId);

      if (wallet.balance < amount) {
        return new BadRequestException(
          `your balance is not enough for  this withdraw:
           balance: ${wallet.balance}`,
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
      return new BadRequestException(error);
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
      return new BadRequestException(error);
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
      return new BadRequestException(error);
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
      return new BadRequestException(error);
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
      return new BadRequestException(error);
    }
  }

  async transaction(walletId, amount, type) {
    try {
      const operation = {
        walletId,
        amount,
        type,
      };

      return this.transactionRepository.create(operation);
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
