import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JournalItemController } from './journalItem.controller';
import { JournalItemService } from './journalItem.service';
import { TagsModule } from 'src/tags';
import { NoteEntity } from 'src/note/note.entity';
import { NotesModule } from 'src/notes';
import { JournalItemEntity } from './journalItem.entity';

@Module({
  imports: [
    SequelizeModule.forFeature([JournalItemEntity]),
    forwardRef(() => TagsModule),
    forwardRef(() => NotesModule)
  ],
  providers: [JournalItemService],
  exports: [JournalItemService],
  controllers: [JournalItemController],
})
export class JournalItemModule {}
