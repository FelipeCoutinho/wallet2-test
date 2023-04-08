import { BadRequestException, Injectable } from '@nestjs/common';
import { CreditCardRepository } from '../creditcard/creditcard.repository';
import { TransactionRepository } from '../transactions/Transaction.repository';
import { CreateWalletDto } from '../wallet/dto/create-wallet.dto';
import { PaymentTypeEnum, operationEnum } from '../wallet/enum/payment.enum';
import { WalletRepository } from '../wallet/prisma/wallet.repository';
import { WalletService } from '../wallet/wallet.service';

@Injectable()
export class ChargebackService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly creditCardRepository: CreditCardRepository,
    private readonly walletService: WalletService,
  ) {}

  async handlerChargeback(
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
          return this.chargebackBalance(wallet, amount, walletId);
        case PaymentTypeEnum.CREDCARD:
          return this.chargebackCreditCard(creditcard, amount, walletId);
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
      const previousBalance = wallet.balance;
      const [chargebackResult, transactionResult] = await Promise.all([
        this.walletRepository.chargeback(walletId, wallet.balance),

        this.transaction(
          walletId,
          amount,
          operationEnum.CHARGEBACK,
          wallet.balance,
          previousBalance,
        ),
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

  async chargebackCreditCard(creditcard, amount: number, walletId: number) {
    try {
      creditcard.balance += amount;
      const previousBalance = creditcard.balance;
      const [chargebackResult, transactionResult] = await Promise.all([
        this.creditCardRepository.chargeback(walletId, creditcard.balance),
        this.transaction(
          walletId,
          amount,
          operationEnum.CHARGEBACK,
          creditcard.balance,
          previousBalance,
        ),
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
