import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Roles, UserRole } from '../auth/guards/roles.guard';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  create(@Body() createOrderDto: CreateOrderDto, @Request() req) {
    return this.orderService.create(createOrderDto, req.user.sub);
  }

  @Get()
  @Roles(UserRole.ADMIN, UserRole.SALES)
  findAll() {
    return this.orderService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(id);
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(id, updateOrderDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.orderService.remove(id);
  }

  @Patch(':id/status/:status')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  updateStatus(@Param('id') id: string, @Param('status') status: string) {
    return this.orderService.updateStatus(id, status);
  }

  @Patch(':id/cancel')
  @Roles(UserRole.ADMIN, UserRole.SALES)
  cancelOrder(@Param('id') id: string) {
    return this.orderService.cancelOrder(id);
  }
}
