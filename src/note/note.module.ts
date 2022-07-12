import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { CommentEntity } from 'src/model/comment.entity';
import { TagsModule } from 'src/tags';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentEntity]),
    TagsModule
  ],
  providers: [NoteService],
  exports: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
