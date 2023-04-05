import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { user } from 'src/wallet/test/user.mock';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(): Promise<any> {
    try {
      return this.prisma.user.createMany({
        data: user,
      });
    } catch (error) {
      throw new Error(error);
    }
  }
  async list(): Promise<any> {
    try {
      return this.prisma.user.findMany();
    } catch (error) {
      throw new Error(error);
    }
  }
}
