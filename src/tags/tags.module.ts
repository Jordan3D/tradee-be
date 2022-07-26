import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagsService } from './tags.service';
import { TagsEntity } from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([TagsEntity])
  ],
  providers: [TagsService],
  exports: [TagsService],
  controllers: [],
})
export class TagsModule {}
