import { BadRequestException, Injectable } from '@nestjs/common';
import { CreditCardRepository } from 'src/creditcard/creditcard.repository';
import { TransactionRepository } from 'src/transactions/Transaction.repository';
import { CreateWalletDto } from 'src/wallet/dto/create-wallet.dto';
import { PaymentTypeEnum, operationEnum } from 'src/wallet/enum/payment.enum';
import { WalletRepository } from 'src/wallet/prisma/wallet.repository';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class PaymentService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly creditCardRepository: CreditCardRepository,
    private readonly walletService: WalletService,
  ) {}

  async handlerPayment(
    walletId: number,
    amount: number,
    typePaymentparam: number,
  ): Promise<any> {
    try {
      const [wallet, creditcard] = await Promise.all([
        this.walletService.findOne(walletId),
        this.walletService.creditCarFindOne(walletId),
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
      const previousBalance = wallet.balance;

      if (wallet.balance < amount) {
        return new BadRequestException(
          'your balance is not enough for  this payment',
        );
      }
      
      if (paymentType === PaymentTypeEnum.BALANCE) {
        wallet.balance -= amount;
      }

      const [paymentResult, transactionResult] = await Promise.all([
        this.walletRepository.payment(walletId, wallet.balance),
        this.transaction(
          walletId,
          amount,
          operationEnum.PAYMENT,
          wallet.balance,
          previousBalance,
        ),
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
      const previousBalance = creditcard.balance;

      if (paymentType === PaymentTypeEnum.CREDCARD) {
        if (creditcard.balance < amount) {
          return new BadRequestException(
            'your balance is not enough for  this payment',
          );
        }

        creditcard.balance -= amount;
      }

      const [peymentResult, transactionResult] = await Promise.all([
        this.creditCardRepository.payment(
          creditcard.credcardId,
          creditcard.balance,
        ),
        this.transaction(
          walletId,
          amount,
          operationEnum.PAYMENT,
          creditcard.balance,
          previousBalance,
        ),
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

      const calcResult = this.balanceDeductionCalculation(
        wallet,
        creditcard,
        amount,
      );

      return await Promise.all([
        this.paymentBalance(
          calcResult.wallet,
          amount,
          wallet.walletId,
          PaymentTypeEnum.MISTO,
        ),
        this.paymentCreditCard(
          calcResult.creditcard,
          amount,
          wallet.walletId,
          PaymentTypeEnum.MISTO,
        ),
      ]);
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  balanceDeductionCalculation(wallet, creditcard, amount) {
    try {
      wallet.balance -= amount;
      creditcard.balance -= Math.abs(wallet.balance);
      wallet.balance = wallet.balance < 0 ? 0 : wallet.balance;
      creditcard.balance = creditcard.balance < 0 ? 0 : creditcard.balance;

      return {
        wallet,
        creditcard,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async transaction(walletId, amount, type, balance, previousBalance) {
    try {
      const operation = {
        walletId,
        amount,
        type,
        balance,
        previousBalance,
      };

      return this.transactionRepository.create(operation);
    } catch (error) {
      return new BadRequestException(error);
    }
  }
}
