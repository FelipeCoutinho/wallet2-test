import { Test } from '@nestjs/testing';
import { WalletService } from '../wallet.service';
import { TransactionRepository } from '../../transactions/Transaction.repository';
import { WalletRepository } from '../prisma/wallet.repository';
import { CreditCardRepository } from '../../creditcard/creditcard.repository';
import {
  CreditCardRepositoryMock,
  TransactionRepositoryMock,
  walletRepositoryMock,
} from './waller.mock';
import { PaymentService } from '../../payment/payment.service';
import { PaymentTypeEnum } from '../enum/payment.enum';

describe('WalletService', () => {
  let walletService: WalletService;
  let walletRepository: WalletRepository;
  let creditCardRepository: CreditCardRepository;
  let transactionRepository: TransactionRepository;
  let paymentService: PaymentService;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: WalletRepository,
          useValue: new walletRepositoryMock(),
        },
        {
          provide: TransactionRepository,
          useValue: new TransactionRepositoryMock(),
        },
        {
          provide: CreditCardRepository,
          useValue: new CreditCardRepositoryMock(),
        },
      ],
    }).compile();

    walletService = module.get<WalletService>(WalletService);
    walletRepository = module.get<WalletRepository>(WalletRepository);
    creditCardRepository =
      module.get<CreditCardRepository>(CreditCardRepository);
    transactionRepository = module.get<TransactionRepository>(
      TransactionRepository,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('When call the function create', () => {
    it('should be created a wallet', async () => {
      const data = {
        balance: 50,
        userId: 9,
      };
      const walletResult = await walletService.create(data);
      expect(walletService.create(data)).resolves.toBeTruthy();
    });
    it('should be return a error ', async () => {
      const data = {
        balance: 50,
        userId: 9,
      };
      const walletResult = await walletService.create(null);
      expect(walletResult.name).toBe('BadRequestException');
    });
  });
  describe('When call the function List', () => {
    it('should return a list the walles', async () => {
      const walletResult = await walletService.list();
      expect(walletResult).toEqual([
        {
          walletId: 10,
          balance: 50,
          userId: 9,
          createdAt: '2023-04-07T16:33:15.938Z',
          updatedAt: '2023-04-07T16:33:15.938Z',
        },
      ]);
    });
  });
  describe('When call the function deposit', () => {
    it('should return a list  the deposit', async () => {
      const walletResult = await walletService.deposit(10, 1000);
      expect({
        walletId: 10,
        amount: 10000,
        type: 'DEPOSIT',
        balance: 10050,
        previousBalance: 50,
      }).toEqual(walletResult.stratum);
    });
  });
  describe('When call the function withdraw', () => {
    it('should return a list the withdraw', async () => {
      const walletResult = await walletService.withdraw(10, 20);
      expect({
        walletId: 10,
        amount: 10000,
        type: 'DEPOSIT',
        balance: 10050,
        previousBalance: 50,
      }).toEqual(walletResult.transactionResult);
    });
  });
});
