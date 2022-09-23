import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DiaryItemController } from './diaryItem.controller';
import { DiaryItemService } from './diaryItem.service';
import { TagsModule } from 'src/tags';
import { DiaryItemEntity } from './diaryItem.entity';
import { TagModule } from 'src/tag';

@Module({
  imports: [
    SequelizeModule.forFeature([DiaryItemEntity]),
    forwardRef(() => TagsModule),
    forwardRef(() => TagModule)
  ],
  providers: [DiaryItemService],
  exports: [DiaryItemService],
  controllers: [DiaryItemController],
})
export class DiaryItemModule {}
