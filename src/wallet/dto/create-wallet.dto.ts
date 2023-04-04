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
  walletId: number;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsNumber()
  typePayment: number;
}
export class chargebackDTO {
  @ApiProperty()
  @IsNumber()
  walletId: number;
  @ApiProperty()
  @IsNumber()
  amount: number;
  @ApiProperty()
  @IsNumber()
  typePayment: number;
}
