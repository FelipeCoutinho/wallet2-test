import { CreateCreditCardDto } from './dto/create-transaction.dto';

export abstract class CreditCardRepository {
  abstract create(operation: CreateCreditCardDto): Promise<any>;
  abstract findOne(walletId): Promise<any>;
  abstract payment(walletId: number, amount: number): Promise<any>;
  // abstract chargeback(walletId: number, amount: number): Promise<any>;
}
