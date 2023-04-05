import { BadRequestException, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/transactions/Transaction.repository';
import { CreateWalletDto } from 'src/wallet/dto/create-wallet.dto';
import { PaymentTypeEnum, operationEnum } from 'src/wallet/enum/payment.enum';
import { WalletRepository } from 'src/wallet/wallet.repository';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class ChargebackService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly transactionRepository: TransactionRepository,
    private readonly walletService: WalletService,
  ) {}

  async handlerChargeback(
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
