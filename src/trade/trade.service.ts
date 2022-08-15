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
import { ITrade, ITradeOverall, TradeByBit } from 'src/interfaces/trade.interface';
import { NotesService } from 'src/notes';
import { TradeEntity } from './trade.entity';
import { CreateBody } from 'src/tag/dto/requests';

@Injectable()
export class TradeService {

  constructor(
    @InjectModel(TradeEntity) private readonly rootModel: typeof TradeEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => NotesService))
    private readonly notesService: NotesService
  ) { }

  async create(data: Omit<ITradeOverall, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITradeOverall> {
    const dataToCreate = { ...data, author: { id: data.authorId } }
    const result = (await this.rootModel.create(dataToCreate)).toJSON();

    let tags = [] as string[];

    if (result && result.id && data.tags) {
      const tagsList = await this.tagsService.create({ tagIds: data.tags, parentId: result.id, parentType: 'note' });
      console.log(tagsList)
      tags = tagsList.map((tL: TagsEntity) => tL.tagId) || [];
    }

    return { ...result, tags };
  }

  async createMultiple(data: Omit<ITradeOverall, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<ITrade[]>{
    try {
      const result = await this.rootModel.bulkCreate(data);
      return result.map(item => item.toJSON())
    }catch(e){
      console.log(e);
    }
  }

  async getById(id: string, omit?: string[]): Promise<ITrade | undefined> {
    const findedOne = await this.rootModel.findOne({
      where: { id },
      raw: true
    });

    const result = findedOne ? { ...findedOne, tags: [], notes: [] } : undefined;

    if (findedOne.id) {
      result.tags = await this.tagsService.getByParentId(findedOne.id);
      result.tags = await this.notesService.getByParentId(findedOne.id);
    }


    if (omit) {
      omit.forEach(o => {
        if (findedOne[o] !== undefined) {
          delete findedOne[o];
        }
      })
    }

    return result;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { id } });

    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<ITradeOverall | undefined> {
    try {
      await this.rootModel.update(updates, { where: { id } });

      if (updates.tagsAdded) {
        await this.tagsService.create({ parentId: id, tagIds: updates.tagsAdded, parentType: 'trade' });
      }
      if (updates.tagsDeleted) {
        await this.tagsService.delete({ parentId: id, tagIds: updates.tagsDeleted });
      }
      if (updates.notesAdded) {
        await this.notesService.create({ parentId: id, noteIds: updates.notesAdded, parentType: 'trade' });
      }
      if (updates.notesDeleted) {
        await this.notesService.delete({ parentId: id, noteIds: updates.notesDeleted });
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: { id },
      raw: true
    });

    return {
      ...one,
      tags: await this.tagsService.getByParentId(id),
      notes: await this.notesService.getByParentId(id)
    }
  }

  async findByDate(
    { startDate, endDate, authorId }:
      Readonly<{ startDate: string, endDate: string, authorId: string }>
  ): Promise<ITrade[]> {
    return await this.rootModel.findAll({ where: { authorId, dateOpen: { $between: [startDate, endDate] } } })
  }

  async findBy(
    { pairId, limit, offset, authorId }:
      Readonly<{ pairId?: string, limit?: number, offset?: number, authorId: string }>
  ): Promise<Readonly<{
    data: ITradeOverall[], total: number, offset: number, limit: number
  }>> {
    const data = (await this.rootModel.sequelize.query(
      `SELECT *  FROM "Trade" trade,
        LATERAL (
           SELECT ARRAY (
              SELECT "tagId"
              FROM   "Tags" tags
              WHERE  tags."parentId" = trade.id
              ) AS tags
           ) t,
           LATERAL (
            SELECT ARRAY (
               SELECT "noteId"
               FROM   "Notes" notes
               WHERE  notes."parentId" = trade.id
               ) AS notes
            ) n
        WHERE "authorId"='${authorId}' ${!pairId ? '' : 'AND "pairId"=\'' + pairId + '\''}
        ORDER BY "createdAt" ASC
        ${limit ? 'LIMIT '+ limit : ''}
        ${offset ? 'OFFSET '+ offset : ''}
        `,
      { type: QueryTypes.SELECT }
    )) as ITradeOverall[];
    const total = await this.rootModel.count({where:{authorId}});

    return {
      data,
      total,
      offset,
      limit
    }
  }
}
