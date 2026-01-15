import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './schemas/product.schema';

@Module({
  imports: [
    // Sử dụng connection 'appConnection' cho Products
    MongooseModule.forFeature(
      [{ name: Product.name, schema: ProductSchema }],
      'appConnection', // Connection khác với Users
    ),
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
