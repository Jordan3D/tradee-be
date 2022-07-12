import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagsEntity } from '../model';
import { UsersModule } from 'src/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagsEntity])
  ],
  providers: [TagService],
  exports: [TagService],
  controllers: [],
})
export class TagModule {}
