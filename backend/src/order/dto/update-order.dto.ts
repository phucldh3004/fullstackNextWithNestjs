import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsString, IsIn, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {}

export enum OrderStatus {
  NEW = 'NEW',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateOrderStatusDto {
  @IsString()
  @IsIn(['NEW', 'PROCESSING', 'COMPLETED', 'CANCELLED'], {
    message: 'Status must be NEW, PROCESSING, COMPLETED, or CANCELLED',
  })
  status: string;
}
