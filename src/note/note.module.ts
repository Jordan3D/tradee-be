import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TagsModule } from 'src/tags';
import { NoteEntity } from 'src/model/note.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([NoteEntity]),
    forwardRef(() => TagsModule)
  ],
  providers: [NoteService],
  exports: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
