import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { NoteController } from './note.controller';
import { NoteService } from './note.service';
import { TagsModule } from 'src/tags';
import { NoteEntity } from 'src/note/note.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([NoteEntity]),
    forwardRef(() => TagsModule)
  ],
  providers: [NoteService],
  exports: [NoteService],
  controllers: [NoteController],
})
export class NoteModule {}
