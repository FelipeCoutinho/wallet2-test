import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class Wallet {
  protected balance: number;
  abstract deposit(value: number): Promise<any>;
  // abstract withdraw();
  // abstract payment();
  // abstract chargeback();
}
