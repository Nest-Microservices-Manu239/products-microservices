import { PartialType } from '@nestjs/mapped-types';
import { CreateProductoDto } from './create-producto.dto';
import { IsInt, IsPositive } from 'class-validator';

export class UpdateProductoDto extends PartialType(CreateProductoDto) {
  @IsInt()
  @IsPositive()
  id: number;
}
