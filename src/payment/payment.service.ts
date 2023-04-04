import { BadRequestException, Injectable } from '@nestjs/common';
import { CreditCardRepository } from 'src/creditcard/creditcard.repository';
import { TransactionRepository } from 'src/transactions/Transaction.repository';
import { CreateWalletDto } from 'src/wallet/dto/create-wallet.dto';
import { PaymentTypeEnum, operationEnum } from 'src/wallet/enum/payment.enum';
import { WalletRepository } from 'src/wallet/wallet.repository';
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
      const wallet = await this.walletService.findOne(walletId);

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
