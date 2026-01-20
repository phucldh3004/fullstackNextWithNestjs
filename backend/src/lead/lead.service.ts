import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateLeadDto } from './dto/create-lead.dto';
import { UpdateLeadDto } from './dto/update-lead.dto';

export enum LeadStatus {
  NEW = 'NEW',
  CONTACTING = 'CONTACTING',
  INTERESTED = 'INTERESTED',
  NOT_POTENTIAL = 'NOT_POTENTIAL',
  CONVERTED = 'CONVERTED',
}

@Injectable()
export class LeadService {
  constructor(private prisma: PrismaService) {}

  async create(createLeadDto: CreateLeadDto, createdBy: string) {
    return this.prisma.lead.create({
      data: {
        ...createLeadDto,
        createdBy,
      },
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });
  }

  async findAll() {
    return this.prisma.lead.findMany({
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });
  }

  async findOne(id: string) {
    const lead = await this.prisma.lead.findUnique({
      where: { id },
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });
    if (!lead) {
      throw new NotFoundException(`Lead with ID ${id} not found`);
    }
    return lead;
  }

  async update(id: string, updateLeadDto: UpdateLeadDto) {
    const updatedLead = await this.prisma.lead.update({
      where: { id },
      data: updateLeadDto,
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });

    return updatedLead;
  }

  async remove(id: string): Promise<void> {
    await this.prisma.lead.delete({
      where: { id },
    });
  }

  async assignLead(id: string, assignedTo: string) {
    return this.update(id, { assignedTo });
  }

  async changeLeadStatus(id: string, status: LeadStatus) {
    return this.update(id, { status });
  }

  async convertToCustomer(id: string, customerId: string) {
    return this.update(id, {
      status: LeadStatus.CONVERTED,
      convertedToCustomer: customerId,
    });
  }

  async findByAssignee(assigneeId: string) {
    return this.prisma.lead.findMany({
      where: { assignedTo: assigneeId },
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });
  }

  async findByStatus(status: LeadStatus) {
    return this.prisma.lead.findMany({
      where: { status },
      include: {
        assignedToUser: true,
        createdByUser: true,
      },
    });
  }
}
