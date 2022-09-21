import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { TagsService } from 'src/tags/tags.service';
import { QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';
import { JournalItemEntity } from './journalItem.entity';
import { NotesService } from 'src/notes';
import { IJournalItem, IJournalItemFull, IJournalItemOverall } from 'src/interfaces/journalItem.interface';
import { NotesEntity } from 'src/notes/notes.entity';
import { format } from 'date-fns';
import { TagService } from 'src/tag';
import { NoteService } from 'src/note';
import { ITag } from 'src/interfaces/tag.interface';
import { INote } from 'src/interfaces/note.interface';
import { TradeService } from 'src/trade';
import { TradeTransactionService } from 'src/tradeTransaction';
import { ITrade } from 'src/interfaces/trade.interface';
import { ITradeTransaction } from 'src/interfaces/tradeTransaction.interface';
import { IdeaService } from 'src/idea/idea.service';

@Injectable()
export class JournalItemService {
  
  constructor(
    @InjectModel(JournalItemEntity) private readonly rootModel: typeof JournalItemEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => TagService))
    private readonly tagService: TagService,
    @Inject(forwardRef(() => NotesService))
    private readonly notesService: NotesService,
    @Inject(forwardRef(() => NoteService))
    private readonly noteService: NoteService,
    @Inject(forwardRef(() => TradeService))
    private readonly tradeService: TradeService,
    @Inject(forwardRef(() => TradeTransactionService))
    private readonly transactionService: TradeTransactionService,
    @Inject(forwardRef(() => IdeaService))
    private readonly ideaService: IdeaService,
  ) {}
  
  async create(data: Omit<IJournalItemOverall, 'id' | 'createdAt' | 'updatedAt' | 'settings'>): Promise<IJournalItemOverall> { 
    const dataToCreate = {...data, author: {id: data.authorId}}
    const result = (await this.rootModel.create(dataToCreate)).toJSON();

    let tags = [] as string[];

    if(result && result.id && data.tags){
      const tagsList = await this.tagsService.create({tagIds: data.tags, parentId: result.id, parentType: 'journal'});
      tags = tagsList.map((tL : TagsEntity) => tL.tagId) || [];
    }
    
    let notes = [] as string[];

    if(result && result.id && data.notes){
      const notesList = await this.notesService.create({noteIds: data.notes, parentId: result.id, parentType: 'journal'});
      notes = notesList.map((nL : NotesEntity) => nL.noteId) || [];
    }

    return {...result, tags, notes};
  }
  
  async getById(id: string, omit?: string[]): Promise<IJournalItem | undefined> {
    const findedOne = await this.rootModel.findOne({
      where: {id},
      raw: true
    });

    const result = findedOne ? {...findedOne, tags: []} : undefined;

    if(findedOne.id){
      result.tags = await this.tagsService.getByParentId(findedOne.id);
    }
    
    
    if(omit){
      omit.forEach(o => {
        if(findedOne[o] !== undefined){
          delete findedOne[o];
        }
      })
    }
    
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({where: {id}});
    
    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<IJournalItemOverall | undefined> {
    try {
      await this.rootModel.update(updates, {where: {id}});

      if(updates.tagsAdded){
        await this.tagsService.create({parentId: id, tagIds: updates.tagsAdded, parentType: 'journal'});
      }
      if(updates.tagsDeleted){
        await this.tagsService.delete({parentId: id, tagIds: updates.tagsDeleted});
      }

      if(updates.notesAdded){
        await this.notesService.create({parentId: id, noteIds: updates.notesAdded, parentType: 'journal'});
      }
      if(updates.notesDeleted){
        await this.notesService.delete({parentId: id, noteIds: updates.notesDeleted});
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: {id},
      raw: true
    });

    return {...one, tags: await this.tagsService.getByParentId(id), notes: await this.notesService.getByParentId(id)}
  }

  async findByDate(
    {startDate, endDate, authorId}: 
    Readonly<{startDate: number, endDate: number, authorId: string}>
    ): Promise<IJournalItemFull[]> {

    let result: IJournalItemFull[] = [];
    const list: IJournalItemOverall[] = await this.rootModel.sequelize.query(
      `SELECT *  FROM "JournalItem" item, LATERAL (
        SELECT ARRAY (
           SELECT "tagId"
           FROM   "Tags" tags
           WHERE  tags."parentId" = item.id
           ) AS tags
        ) t,
        LATERAL (
          SELECT ARRAY (
             SELECT "noteId"
             FROM   "Notes" notes
             WHERE  notes."parentId" = item.id
             ) AS notes
          ) n
      WHERE "authorId"='${authorId}'
      AND "createdAt" BETWEEN '${format(new Date(startDate * 1000), 'yyyy/MM/dd')}' AND '${format(new Date(endDate * 1000), 'yyyy/MM/dd')}'`
,  { type: QueryTypes.SELECT });
 
   result = await Promise.all(list.map(async item => {
    const itemResult = {...item, tags: [], notes: [], pnls: [], transactions: [], ideas: []} as IJournalItemFull;
    itemResult.tags = await this.tagService.getByIds(item.tags);
    itemResult.notes = await this.noteService.getByIds(item.notes);
    itemResult.pnls = await this.tradeService.getByIds(item.pnls);
    itemResult.transactions = await this.transactionService.getByIds(item.transactions);
    itemResult.ideas = await this.ideaService.getByIds(item.ideas);
    return itemResult;
   }));

   return result;
  }

  async findBy(
    {text, authorId, lastId, limit}: 
    Readonly<{text?: string, authorId: string, limit?: number, lastId?: string}>
    ): Promise<IJournalItem[]> {
      const id = lastId ? {$gt: lastId} : {};
      return await this.rootModel.sequelize.query(
        `SELECT *  FROM "Note" note,
        LATERAL (
           SELECT ARRAY (
              SELECT "tagId"
              FROM   "Tags" tags
              WHERE  tags."parentId" = note.id
              ) AS tags
           ) t
        WHERE "authorId"='${authorId}'
        ORDER BY "createdAt" ASC`,
         { type: QueryTypes.SELECT }
        );
  }

  async findById(
    {id}: 
    Readonly<{id: string}>
    ): Promise<IJournalItemOverall> {

    const list: IJournalItemOverall[] = await this.rootModel.sequelize.query(
      `SELECT *  FROM "JournalItem" item, LATERAL (
        SELECT ARRAY (
           SELECT "tagId"
           FROM   "Tags" tags
           WHERE  tags."parentId" = item.id
           ) AS tags
        ) t,
        LATERAL (
          SELECT ARRAY (
             SELECT "noteId"
             FROM   "Notes" notes
             WHERE  notes."parentId" = item.id
             ) AS notes
          ) n
      WHERE "id"='${id}'`
,  { type: QueryTypes.SELECT });

   return list.map(item => ({...item, tags: [], notes: []})).length ? list[0] : undefined;
  }
}
