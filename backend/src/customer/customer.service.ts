import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  async create(createCustomerDto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: createCustomerDto,
    });
  }

  async findAll() {
    return this.prisma.customer.findMany({
      include: {
        assignedToUser: true,
      },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: {
        assignedToUser: true,
      },
    });
    if (!customer) {
      throw new NotFoundException(`Customer with ID ${id} not found`);
    }
    return customer;
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.prisma.customer.update({
      where: { id },
      data: updateCustomerDto,
      include: {
        assignedToUser: true,
      },
    });

    return updatedCustomer;
  }

  async remove(id: string): Promise<void> {
    const result = await this.prisma.customer.delete({
      where: { id },
    });
    return result;
  }

  async findByEmail(email: string) {
    return this.prisma.customer.findUnique({
      where: { email },
    });
  }

  async classifyCustomer(id: string, customerType: string) {
    return this.update(id, { customerType });
  }

  async getInteractionHistory(customerId: string): Promise<any[]> {
    // TODO: Implement interaction history from other modules (orders, tickets, etc.)
    // This would typically aggregate data from multiple tables
    return [];
  }
}
