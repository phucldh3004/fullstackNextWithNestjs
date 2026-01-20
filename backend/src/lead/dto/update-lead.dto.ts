import { PartialType } from '@nestjs/mapped-types';
import { CreateLeadDto } from './create-lead.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { LeadStatus } from '../lead.service';

export class UpdateLeadDto extends PartialType(CreateLeadDto) {
  @IsOptional()
  @IsEnum(LeadStatus)
  status?: LeadStatus;

  @IsOptional()
  @IsString()
  assignedTo?: string;

  @IsOptional()
  @IsString()
  convertedToCustomer?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
