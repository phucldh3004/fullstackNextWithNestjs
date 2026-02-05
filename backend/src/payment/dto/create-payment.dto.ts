import { IsString, IsNumber, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsNotEmpty()
  customerId: string;

  @IsString()
  @IsOptional()
  orderId?: string;

  @IsEnum(['CASH', 'BANK_TRANSFER', 'ONLINE_PAYMENT'])
  @IsOptional()
  paymentMethod?: string; // CASH, BANK_TRANSFER, ONLINE_PAYMENT

  @IsString()
  @IsOptional()
  notes?: string;
}
