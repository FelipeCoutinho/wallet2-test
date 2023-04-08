import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data): Promise<any> {
    try {
      return this.prisma.user.create({
        data,
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
