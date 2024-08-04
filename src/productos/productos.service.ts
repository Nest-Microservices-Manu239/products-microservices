import { HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaClient } from '@prisma/client';
import { PaginatioDto } from 'src/common/dtos/pagination.dto';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductosService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductosService');
  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }
  create(createProductoDto: CreateProductoDto) {
    return this.product.create({
      data: createProductoDto,
    });
  }

  async findAll(paginationDto: PaginatioDto) {
    const { page, limit } = paginationDto;
    const where = { available: true };
    const total = await this.product.count({ where });
    const totalPages = Math.ceil(total / limit);
    return {
      data: await this.product.findMany({
        take: limit,
        skip: (page - 1) * limit,
        where,
      }),
      meta: {
        page,
        total,
        totalpages: totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findUnique({
      where: {
        id,
        available: true,
      },
    });

    if (!product) {
      throw new RpcException({
        message: `Producto with id: ${id}, not found`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return product;
  }

  async update(updateProductoDto: UpdateProductoDto) {
    const { id, ...data } = updateProductoDto;
    await this.findOne(id);
    return this.product.update({
      where: {
        id,
      },
      data: data,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.product.update({
      where: {
        id,
      },
      data: {
        available: false,
      },
    });

    /* HARD DELETE
    return this.product.delete({
      where: {
        id,
      },
    }); */
  }

  async validateProducts(productIds: number[]) {
    const ids = Array.from(new Set(productIds));

    const products = await this.product.findMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    if (products.length !== ids.length) {
      throw new RpcException({
        status: HttpStatus.BAD_REQUEST,
        message: 'Some products were not found',
      });
    }

    return products;
  }
}
