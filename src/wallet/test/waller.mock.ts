import { TransactionRepository } from '../../transactions/Transaction.repository';
import { CreditCardRepository } from '../../creditcard/creditcard.repository';
import { WalletRepository } from '../prisma/wallet.repository';
import { CreateWalletDto } from '../dto/create-wallet.dto';

export const prismaMock = {
  User: {
    create: jest.fn().mockResolvedValue([
      {
        userId: 10,
        email: 'douglas@testes.com.br',
        name: 'Douglas',
        createdAt: '2023-04-07T16:36:59.438Z',
        updatedAt: '2023-04-07T16:36:59.438Z',
      },
    ]),
  },
  wallet: {
    create: jest.fn().mockResolvedValue({
      walletId: 10,
      balance: 50,
      userId: 9,
      createdAt: '2023-04-07T16:33:15.938Z',
      updatedAt: '2023-04-07T16:33:15.938Z',
    }),
    deposit: jest.fn().mockResolvedValue(true),
    findOne: jest.fn().mockResolvedValue({
      walletId: 10,
      balance: 50,
      userId: 9,
      createdAt: '2023-04-07T16:33:15.938Z',
      updatedAt: '2023-04-07T16:33:15.938Z',
    }),
    withdraw: jest.fn().mockResolvedValue(true),
    payment: jest.fn().mockResolvedValue(true),
    chargeback: jest.fn().mockResolvedValue(true),
    list: jest.fn().mockResolvedValue([
      {
        walletId: 10,
        balance: 50,
        userId: 9,
        createdAt: '2023-04-07T16:33:15.938Z',
        updatedAt: '2023-04-07T16:33:15.938Z',
      },
    ]),
  },
  transactions: {
    create: jest.fn().mockResolvedValue({
      walletId: 10,
      amount: 10000,
      type: 'DEPOSIT',
      balance: 10050,
      previousBalance: 50,
    }),
  },
  creditcard: {
    create: jest.fn().mockResolvedValue({
      credcardId: 7,
      balance: 2000,
      active: true,
      walletId: 10,
      createdAt: '2023-04-07T16:34:45.352Z',
      updatedAt: '2023-04-07T16:34:45.352Z',
    }),
    findOne: jest.fn().mockResolvedValue({
      credcardId: 7,
      balance: 2000,
      active: true,
      walletId: 10,
      createdAt: '2023-04-07T16:34:45.352Z',
      updatedAt: '2023-04-07T16:34:45.352Z',
    }),
    payment: jest.fn().mockResolvedValue(true),
    chargeback: jest.fn().mockResolvedValue(true),
  },
};
export class CreditCardRepositoryMock implements CreditCardRepository {
  async create(operation: any): Promise<any> {
    return prismaMock.creditcard.create();
  }

  async findOne(walletId: any): Promise<any> {
    return prismaMock.creditcard.findOne();
  }
  async payment(credcardId: number, amount: number): Promise<any> {
    return prismaMock.creditcard.payment();
  }
  async chargeback(credcardId: number, amount: number): Promise<any> {
    return prismaMock.creditcard.chargeback();
  }
}

export class TransactionRepositoryMock implements TransactionRepository {
  async create(operation: any): Promise<any> {
    return prismaMock.transactions.create();
  }
}
export class walletRepositoryMock implements WalletRepository {
  async create(walletParam: CreateWalletDto): Promise<any> {
    const wallet = [];
    wallet.push(walletParam);
    return prismaMock.wallet.create();
  }

  async deposit(walletId: number, amount: number): Promise<any> {
    return prismaMock.wallet.deposit();
  }
  async findOne(walletId: number): Promise<any> {
    return prismaMock.wallet.findOne();
  }
  async withdraw(walletId: number, amount: number): Promise<any> {
    return prismaMock.wallet.withdraw();
  }
  async payment(walletId: number, amount: number): Promise<any> {
    return prismaMock.wallet.payment();
  }
  async chargeback(walletId: number, amount: number): Promise<any> {
    return prismaMock.wallet.chargeback();
  }
  async list(): Promise<any> {
    return prismaMock.wallet.list();
  }
}
