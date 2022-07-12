import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { CommentEntity } from 'src/model/comment.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity])
  ],
  providers: [NoteService],
  exports: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
