export abstract class BankstatementRepository {
  abstract findMany(walletId: number): Promise<any>;
}
