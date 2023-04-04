import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class CreateCreditCardDto {
  @ApiProperty()
  @IsNumber()
  balance: number;
  @ApiProperty()
  @IsNumber()
  active: boolean;
  @ApiProperty()
  @IsNumber()
  walletId: number;
}
