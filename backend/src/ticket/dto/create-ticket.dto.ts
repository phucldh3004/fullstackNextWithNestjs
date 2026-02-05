import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateTicketDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  customerId?: string;

  @IsEnum(['LOW', 'MEDIUM', 'HIGH', 'URGENT'])
  @IsOptional()
  priority?: string; // LOW, MEDIUM, HIGH, URGENT

  @IsString()
  @IsOptional()
  assignedTo?: string; // User ID
}
