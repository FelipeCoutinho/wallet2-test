import { CreateWalletDto } from './dto/create-wallet.dto';
export abstract class WalletRepository {
  abstract create(wallet: CreateWalletDto): Promise<any>;
  abstract deposit(walletId: number, amount: number): Promise<any>;
  abstract findOne(walletId: number): Promise<any>;
  abstract withdraw(walletId: number, amount: number): Promise<any>;
  abstract payment(walletId: number, amount: number): Promise<any>;
  abstract chargeback(walletId: number, amount: number): Promise<any>;
}
