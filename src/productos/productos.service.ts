import {
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PrismaClient } from '@prisma/client';
import { PaginatioDto } from 'src/common/dtos/pagination.dto';

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
      throw new NotFoundException(`Producto with id: ${id}, not found`);
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
}
