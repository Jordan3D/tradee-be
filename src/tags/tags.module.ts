import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsService } from './tags.service';
import { TagsEntity } from '../model';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagsEntity])
  ],
  providers: [TagsService],
  exports: [TagsService],
  controllers: [],
})
export class TagsModule {}
