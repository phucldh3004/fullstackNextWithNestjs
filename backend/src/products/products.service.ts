import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductDocument } from './schemas/product.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name, 'appConnection') // Sử dụng appConnection
    private productModel: Model<ProductDocument>,
  ) {}

  async create(createProductDto: CreateProductDto): Promise<Product> {
    console.log('➕ Creating product:', createProductDto);
    const createdProduct = new this.productModel(createProductDto);
    const savedProduct = await createdProduct.save();
    console.log('✅ Product created:', savedProduct);
    return savedProduct;
  }

  async findAll(): Promise<Product[]> {
    const products = await this.productModel.find().exec();
    console.log('📦 Found products:', products.length);
    console.log(products);
    return products;
  }

  async findOne(id: string): Promise<Product | null> {
    console.log('🔍 Finding product by ID:', id);
    
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }
    
    const product = await this.productModel.findById(id).exec();
    
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    console.log('Product found:', product);
    return product;
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product | null> {
    console.log('✏️ Updating product:', id, updateProductDto);
    
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }
    
    const updatedProduct = await this.productModel
      .findByIdAndUpdate(id, updateProductDto, { new: true })
      .exec();
    
    if (!updatedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    console.log('Updated product:', updatedProduct);
    return updatedProduct;
  }

  async remove(id: string): Promise<Product | null> {
    console.log('🗑️ Removing product:', id);
    
    // Validate ObjectId format
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid ObjectId format');
    }
    
    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();
    
    if (!deletedProduct) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    
    console.log('Deleted product:', deletedProduct);
    return deletedProduct;
  }
}

