import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagService } from './tag.service';
import { TagsEntity } from 'src/models';

@Module({
  imports: [
    SequelizeModule.forFeature([TagsEntity])
  ],
  providers: [TagService],
  exports: [TagService],
  controllers: [],
})
export class TagModule {}
