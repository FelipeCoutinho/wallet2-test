import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';
export class CreateWalletDto {
  @ApiProperty()
  @IsNumber()
  balance: number;
  @ApiProperty()
  @IsNumber()
  userId: number;
}

export class paymentDTO {
  @ApiProperty()
  @IsNumber()
  amount: number;
}
