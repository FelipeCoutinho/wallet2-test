import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { WalletRepository } from './wallet.repository';
import { PaymentTypeEnum } from './enum/payment.enum';
import { operationEnum } from './enum/payment.enum';
import { TransactionRepository } from 'src/transactions/Transaction.repository';
import { CreditCardRepository } from 'src/creditcard/creditcard.repository';
import { type } from 'os';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly creditCardRepository: CreditCardRepository,
  ) {}

  async create(wallet: CreateWalletDto): Promise<any> {
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

  async findOne(walletId): Promise<any> {
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

  async handlerPayment(
    walletId: number,
    amount: number,
    typePaymentparam: number,
  ): Promise<any> {
    try {
      const [wallet, creditcard] = await Promise.all([
        this.findOne(walletId),
        this.creditCarFindOne(walletId),
      ]);

      switch (typePaymentparam) {
        case PaymentTypeEnum.BALANCE:
          return this.paymentBalance(
            wallet,
            amount,
            walletId,
            PaymentTypeEnum.BALANCE,
          );
        case PaymentTypeEnum.CREDCARD:
          return this.paymentCreditCard(
            creditcard,
            amount,
            walletId,
            PaymentTypeEnum.BALANCE,
          );
        case PaymentTypeEnum.MISTO:
          return this.paymentMisto({ creditcard, wallet, amount: amount });
        default:
          return this.paymentBalance(
            wallet,
            amount,
            walletId,
            PaymentTypeEnum.BALANCE,
          );
      }
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async paymentBalance(
    wallet: CreateWalletDto,
    amount: number,
    walletId: number,
    paymentType: number,
  ) {
    try {
      if (paymentType === PaymentTypeEnum.BALANCE) {
        if (wallet.balance < amount) {
          return new BadRequestException(
            'your balance is not enough for  this payment',
          );
        }
      }

      wallet.balance -= amount;

      const [paymentResult, transactionResult] = await Promise.all([
        this.walletRepository.payment(walletId, wallet.balance),
        this.transaction(walletId, amount, operationEnum.PAYMENT),
      ]);

      return {
        balance: paymentResult.balance,
        payment: amount,
        paymentMethod: 'balance',
        transactionResult,
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }
  async paymentCreditCard(
    creditcard,
    amount: number,
    walletId: number,
    paymentType: number,
  ) {
    try {
      if (paymentType === PaymentTypeEnum.CREDCARD) {
        if (creditcard.balance < amount) {
          return new BadRequestException(
            'your balance is not enough for  this payment',
          );
        }
      }

      creditcard.balance -= amount;

      const [peymentResult, transactionResult] = await Promise.all([
        this.creditCardRepository.payment(
          creditcard.credcardId,
          creditcard.balance,
        ),
        this.transaction(walletId, amount, operationEnum.PAYMENT),
      ]);

      return {
        balance: peymentResult.balance,
        payment: amount,
        paymentMethod: 'balance',
        transactionResult,
      };
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async paymentMisto(params) {
    const { creditcard, wallet, amount } = params;
    try {
      const saldoTotal = wallet.balance + creditcard.balance;

      if (saldoTotal < amount) {
        return new BadRequestException(
          'your balance is not enough for this payment',
        );
      }

      if (wallet.balance >= amount) {
        wallet.balance -= amount;
        return await this.paymentBalance(
          wallet,
          amount,
          wallet.walletId,
          PaymentTypeEnum.MISTO,
        );
      }

      wallet.balance -= amount;
      creditcard.balance -= amount;

      return await Promise.all([
        this.paymentBalance(
          wallet,
          amount,
          wallet.walletId,
          PaymentTypeEnum.MISTO,
        ),
        this.paymentCreditCard(
          creditcard,
          amount,
          wallet.walletId,
          PaymentTypeEnum.MISTO,
        ),
      ]);
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
        case PaymentTypeEnum.BALANCE:
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

      const [chargebackResult, transactionResult] = await Promise.all([
        this.walletRepository.chargeback(walletId, wallet.balance),

        this.transaction(walletId, amount, operationEnum.CHARGEBACK),
      ]);

      return {
        balance: chargebackResult.balance,
        chargeback: amount,
        paymentMethod: 'balance',
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
