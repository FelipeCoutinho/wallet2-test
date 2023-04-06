import { PartialType } from '@nestjs/swagger';
import { CreateBankstatemantDto } from './create-bankstatemant.dto';

export class UpdateBankstatemantDto extends PartialType(CreateBankstatemantDto) {}
