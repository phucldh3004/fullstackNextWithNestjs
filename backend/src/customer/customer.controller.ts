import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto, CustomerType } from './dto/update-customer.dto';
import { Roles, UserRole } from '../auth/guards/roles.guard';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customerService.create(createCustomerDto);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  findAll() {
    return this.customerService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  findOne(@Param('id') id: string) {
    return this.customerService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  update(@Param('id') id: string, @Body() updateCustomerDto: UpdateCustomerDto) {
    return this.customerService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.customerService.remove(id);
  }

  @Patch(':id/classify/:type')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  classifyCustomer(@Param('id') id: string, @Param('type') type: string) {
    return this.customerService.classifyCustomer(id, type as CustomerType);
  }

  @Get(':id/interactions')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  getInteractionHistory(@Param('id') id: string) {
    return this.customerService.getInteractionHistory(id);
  }
}
