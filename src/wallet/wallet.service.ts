import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './wallet.repository';
import { operationEnum } from './enum/payment.enum';
import { TransactionRepository } from 'src/transactions/Transaction.repository';
import { CreditCardRepository } from 'src/creditcard/creditcard.repository';
@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly creditCardRepository: CreditCardRepository,
  ) {}

  public async create(wallet: CreateWalletDto): Promise<any> {
    try {
      const walletResult = await this.walletRepository.create(wallet);

      const card = {
        balance: 2000,
        active: true,
        walletId: walletResult.walletId,
      };

      return this.creditCardRepository.create(card);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  public async findOne(walletId): Promise<any> {
    try {
      return this.walletRepository.findOne(walletId);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async creditCarFindOne(walletId): Promise<any> {
    try {
      return this.creditCardRepository.findOne(walletId);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async deposit(walletId: number, amount: number): Promise<any> {
    try {
      const wallet = await this.findOne(walletId);

      wallet.balance += amount;

      const [resultDeposit, transactionResult] = await Promise.all([
        this.walletRepository.deposit(walletId, wallet.balance),
        this.transaction(walletId, amount, operationEnum.DEPOSIT),
      ]);

      return {
        wallet: {
          balance: resultDeposit.balance,
          deposit: amount,
        },
        stratum: transactionResult,
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

      const [withdrawResult, transactionResult] = await Promise.all([
        this.walletRepository.withdraw(walletId, wallet.balance),
        this.transaction(walletId, amount, operationEnum.DEPOSIT),
      ]);

      return {
        balance: withdrawResult.balance,
        saque: amount,
        transactionResult,
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
