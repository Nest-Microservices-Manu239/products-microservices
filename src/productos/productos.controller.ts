import {
  Controller,
  //Get,
  //Post,
  //Body,
  //Patch,
  //Param,
  //Delete,
  //Query,
  ParseIntPipe,
} from '@nestjs/common';
import { ProductosService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { PaginatioDto } from 'src/common/dtos/pagination.dto';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('productos')
export class ProductosController {
  constructor(private readonly productosService: ProductosService) {}

  //@Post()
  @MessagePattern({ cmd: 'create_product' })
  create(@Payload() createProductoDto: CreateProductoDto) {
    return this.productosService.create(createProductoDto);
  }

  //@Get()
  @MessagePattern({ cmd: 'find_all_products' })
  findAll(@Payload() paginationDto: PaginatioDto) {
    return this.productosService.findAll(paginationDto);
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'find_one_product' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productosService.findOne(id);
  }

  //@Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductoDto: UpdateProductoDto) {
    return this.productosService.update(updateProductoDto);
  }

  //@Delete(':id')
  @MessagePattern({ cmd: 'delete_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productosService.remove(id);
  }

  @MessagePattern({ cmd: 'validate_products' })
  validateProducts(@Payload() productIds: number[]) {
    return this.productosService.validateProducts(productIds);
  }
}
