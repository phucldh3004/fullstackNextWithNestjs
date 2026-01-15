import { IsString, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @IsString()
  @IsOptional()
  description?: string;
}

