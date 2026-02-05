import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  IsJSON,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty({ message: 'Customer ID is required' })
  customerId: string;

  @IsNumber()
  @Min(0, { message: 'Total amount must be positive' })
  totalAmount: number;

  @IsOptional()
  items?: any; // JSON field for order items

  @IsString()
  @IsOptional()
  notes?: string;
}
