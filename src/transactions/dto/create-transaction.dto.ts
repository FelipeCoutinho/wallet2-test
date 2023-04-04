import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty()
  @IsNumber()
  balance: number;
  @ApiProperty()
  @IsNumber()
  userId: number;
}
