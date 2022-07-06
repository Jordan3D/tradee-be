import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagEntity, UserEntity } from '../model';
import { UsersModule } from 'src/user';

@Module({
  imports: [
    TypeOrmModule.forFeature([TagEntity]),
    forwardRef(() => UsersModule),
  ],
  providers: [TagService],
  exports: [TagService],
  controllers: [TagController],
})
export class TagModule {}
