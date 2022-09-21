import { forwardRef, Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { JournalItemController } from './journalItem.controller';
import { JournalItemService } from './journalItem.service';
import { TagsModule } from 'src/tags';
import { NoteEntity } from 'src/note/note.entity';
import { NotesModule } from 'src/notes';
import { JournalItemEntity } from './journalItem.entity';
import { TagModule } from 'src/tag';
import { NoteModule } from 'src/note';
import { TradeModule } from 'src/trade';
import { TradeTransactionModule } from 'src/tradeTransaction';
import { IdeaModule } from 'src/idea';

@Module({
  imports: [
    SequelizeModule.forFeature([JournalItemEntity]),
    forwardRef(() => TagsModule),
    forwardRef(() => TagModule),
    forwardRef(() => NotesModule),
    forwardRef(() => NoteModule),
    forwardRef(() => TradeModule),
    forwardRef(() => TradeTransactionModule),
    forwardRef(() => IdeaModule),
  ],
  providers: [JournalItemService],
  exports: [JournalItemService],
  controllers: [JournalItemController],
})
export class JournalItemModule {}
