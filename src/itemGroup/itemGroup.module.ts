import { Module } from '@nestjs/common';
import { ItemGroupService } from './itemGroup.service';
import { ItemGroupController } from './itemGroup.controller';
import { UsersModule } from '../users/index';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemGroupEntity } from '../model/index';

@Module({
  imports: [
    TypeOrmModule.forFeature([ItemGroupEntity]),
    UsersModule
  ],
  providers: [
    ItemGroupService
  ],
  exports: [ItemGroupService],
  controllers: [ItemGroupController],
})
export class ItemGroupModule {}