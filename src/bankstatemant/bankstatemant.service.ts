import { Injectable } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { BankstatementRepository } from './prisma/bankstate.repository';

@Injectable()
export class BankstatemantService {
  constructor(
    private readonly banckstatementeRepository: BankstatementRepository,
  ) {}
  async findOne(id: number) {
    try {
      const result = await this.banckstatementeRepository.findMany(id);
      await this.createBanckStatemente(result);
      return result;
    } catch (error) {
      return new BadRequestException(error);
    }
  }

  async createBanckStatemente(data) {}
}
