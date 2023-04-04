export abstract class TransactionRepository {
  abstract create(operation): Promise<any>;
}
