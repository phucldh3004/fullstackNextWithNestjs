import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
} from '@nestjs/common';
import { LeadService } from './lead.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { RolesGuard, Roles, UserRole } from '../auth/guards/roles.guard';

@Controller('leads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class LeadController {
  constructor(private readonly leadService: LeadService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  create(@Body() createLeadDto: CreateLeadDto, @Request() req) {
    return this.leadService.create(createLeadDto, req.user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  findAll() {
    return this.leadService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  findOne(@Param('id') id: string) {
    return this.leadService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  update(@Param('id') id: string, @Body() updateLeadDto: UpdateLeadDto) {
    return this.leadService.update(id, updateLeadDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.leadService.remove(id);
  }

  @Patch(':id/assign/:assigneeId')
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  assignLead(@Param('id') id: string, @Param('assigneeId') assigneeId: string) {
    return this.leadService.assignLead(id, assigneeId);
  }

  @Patch(':id/status/:status')
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  changeStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.leadService.changeLeadStatus(id, status as any);
  }

  @Patch(':id/convert/:customerId')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  convertToCustomer(@Param('id') id: string, @Param('customerId') customerId: string) {
    return this.leadService.convertToCustomer(id, customerId);
  }

  @Get('assignee/:assigneeId')
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  findByAssignee(@Param('assigneeId') assigneeId: string) {
    return this.leadService.findByAssignee(assigneeId);
  }

  @Get('status/:status')
  @Roles(UserRole.ADMIN, UserRole.SALES, UserRole.MARKETING)
  findByStatus(@Param('status') status: string) {
    return this.leadService.findByStatus(status as any);
  }
}
