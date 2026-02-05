import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto, OrderStatus } from './dto/update-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Get count of orders today
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));
    
    const count = await this.prisma.order.count({
      where: {
        createdAt: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const sequence = String(count + 1).padStart(4, '0');
    return `ORD-${year}${month}${day}-${sequence}`;
  }

  async create(createOrderDto: CreateOrderDto, userId: string) {
    console.log('➕ Creating order:', createOrderDto);

    // Verify customer exists
    const customer = await this.prisma.customer.findUnique({
      where: { id: createOrderDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createOrderDto.customerId} not found`,
      );
    }

    const orderNumber = await this.generateOrderNumber();

    const order = await this.prisma.order.create({
      data: {
        ...createOrderDto,
        orderNumber,
        createdBy: userId,
      },
      include: {
        customer: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('✅ Order created:', order);
    return order;
  }

  async findAll() {
    const orders = await this.prisma.order.findMany({
      include: {
        customer: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    console.log('📋 Found orders:', orders.length);
    return orders;
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    console.log('🔍 Order found:', order);
    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    console.log('✏️ Updating order:', id, updateOrderDto);

    await this.findOne(id); // Verify order exists

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: updateOrderDto,
      include: {
        customer: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('✅ Order updated:', updatedOrder);
    return updatedOrder;
  }

  async remove(id: string) {
    console.log('🗑️ Removing order:', id);

    await this.findOne(id); // Verify order exists

    const deletedOrder = await this.prisma.order.delete({
      where: { id },
    });

    console.log('✅ Order deleted:', deletedOrder);
    return { message: 'Order deleted successfully', order: deletedOrder };
  }

  async updateStatus(id: string, status: string) {
    console.log('🔄 Updating order status:', id, status);

    const order = await this.findOne(id);

    // Validate status transition
    const validTransitions = {
      NEW: ['PROCESSING', 'CANCELLED'],
      PROCESSING: ['COMPLETED', 'CANCELLED'],
      COMPLETED: [],
      CANCELLED: [],
    };

    if (!validTransitions[order.status]?.includes(status)) {
      throw new BadRequestException(
        `Cannot transition from ${order.status} to ${status}`,
      );
    }

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        customer: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('✅ Order status updated:', updatedOrder);
    return updatedOrder;
  }

  async cancelOrder(id: string) {
    console.log('❌ Cancelling order:', id);

    const order = await this.findOne(id);

    if (order.status === OrderStatus.COMPLETED) {
      throw new BadRequestException('Cannot cancel a completed order');
    }

    if (order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Order is already cancelled');
    }

    const cancelledOrder = await this.prisma.order.update({
      where: { id },
      data: { status: OrderStatus.CANCELLED },
      include: {
        customer: true,
        createdByUser: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('✅ Order cancelled:', cancelledOrder);
    return cancelledOrder;
  }
}
