import { CreateWalletDto } from './dto/create-wallet.dto';

export abstract class WalletRepository {
  abstract create(wallet: CreateWalletDto): Promise<any>;
  // abstract update(wallet: CreateWalletDto): Promise<any>;
  abstract deposit(walletId: number, amount: number): Promise<any>;
  abstract findOne(walletId: number): Promise<any>;
  abstract withdraw(walletId: number, amount: number): Promise<any>;

  // abstract payment();
  // abstract chargeback();
}
