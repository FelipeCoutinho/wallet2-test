import { CreateWalletDto } from './dto/create-wallet.dto';

export abstract class WalletRepository {
  abstract create(wallet: CreateWalletDto): Promise<any>;
  // abstract deposit(value: number): Promise<void>;
  // abstract withdraw();
  // abstract payment();
  // abstract chargeback();
}
