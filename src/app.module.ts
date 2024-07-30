import { Module } from '@nestjs/common';
import { ProductosModule } from './productos/productos.module';
import { CommonModule } from './common/common.module';

@Module({
  imports: [ProductosModule, CommonModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
