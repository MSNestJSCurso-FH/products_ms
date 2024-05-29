import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dto';

@Injectable()
// export class ProductsService {
export class ProductsService extends PrismaClient implements OnModuleInit {
  // Definir logger en nestjs
  private readonly logger = new Logger('ProductsService');

  onModuleInit() {
    this.$connect();
    // console.log('Database connected');
    this.logger.log('Database connected');
  }

  create(createProductDto: CreateProductDto) {
    // Crear un producto en la DB (Prisma)
    return this.product.create({
      data: createProductDto,
    });
  }

  // findAll() {
  async findAll(query: PaginationDto) {
    const { page, limit } = query;

    // const totalPage = await this.product.count();
    const totalItems = await this.product.count({
      where: { available: true },
    });
    const lastPage = Math.ceil(totalItems / limit);

    // Obtener todos los productos de la DB (Prisma)
    // return this.product.findMany({
    //   skip: (page - 1) * limit,
    //   take: limit,
    // });
    return {
      data: await this.product.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: {
          available: true,
        },
      }),
      meta: {
        // total: totalPage,
        total: totalItems,
        // page: page,
        page,
        // lastPage: lastPage,
        lastPage,
      },
    };
  }

  async findOne(id: number) {
    // Buscar el producto por ID y que este disponible
    const product = await this.product.findFirst({
      where: { id, available: true },
    });

    if (!product)
      throw new NotFoundException(`Product with id #${id} not found`);

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;
    console.log(__);

    // Buscar y validar el ID del producto
    await this.findOne(id);

    // Actualizar el producto en la DB (Prisma)
    return this.product.update({
      where: { id },
      // data: updateProductDto,
      data: data,
    });
  }

  async remove(id: number) {
    // Buscar y validar el id del producto
    await this.findOne(id);

    // Eliminar el producto de la DB (Prisma)
    // Hard delete
    // return this.product.delete({
    //   where: { id },
    // });
    // Soft delete
    const product = await this.product.update({
      where: { id },
      data: {
        available: false,
      },
    });

    return product;
  }
}
