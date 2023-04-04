import { CreateCreditCardDto } from './dto/create-transaction.dto';

export abstract class CreditCardRepository {
  abstract create(operation: CreateCreditCardDto): Promise<any>;
}
