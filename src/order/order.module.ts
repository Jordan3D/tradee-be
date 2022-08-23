import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

@Module({
  imports: [
    SequelizeModule.forFeature([OrderEntity]),
  ],
  providers: [OrderService],
  exports: [OrderService],
  controllers: [],
})
export class OrderModule {}
