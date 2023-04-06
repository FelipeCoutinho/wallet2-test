import { Test, TestingModule } from '@nestjs/testing';
import { BankstatemantService } from './bankstatemant.service';

describe('BankstatemantService', () => {
  let service: BankstatemantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BankstatemantService],
    }).compile();

    service = module.get<BankstatemantService>(BankstatemantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
