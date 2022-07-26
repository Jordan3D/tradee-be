import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { TagEntity } from 'src/models';
import { UsersModule } from 'src/user';

@Module({
  imports: [
    SequelizeModule.forFeature([TagEntity]),
    forwardRef(() => UsersModule),
  ],
  providers: [TagService],
  exports: [TagService],
  controllers: [TagController],
})
export class TagModule {}
