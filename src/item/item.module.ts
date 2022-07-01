import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { UsersModule } from '../users';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemEntity } from '../model';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemEntity]),
    UsersModule
  ],
  providers: [
    ItemService
  ],
  exports: [ItemService],
  controllers: [ItemController],
})
export class ItemModule {}