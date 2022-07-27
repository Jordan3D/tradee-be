import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { CommentEntity } from 'src/comment/comment.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([CommentEntity])
  ],
  providers: [CommentService],
  exports: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
