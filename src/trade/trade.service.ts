import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { TagsService } from 'src/tags/tags.service';
import { Op, QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';
import { ITrade, ITradeOverall, TradeByBit } from 'src/interfaces/trade.interface';
import { NotesService } from 'src/notes';
import { TradeEntity } from './trade.entity';
@Injectable()
export class TradeService {

  constructor(
    @InjectModel(TradeEntity) private readonly rootModel: typeof TradeEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService,
    @Inject(forwardRef(() => NotesService))
    private readonly notesService: NotesService
  ) { 
   
  }

  async create(data: Omit<ITradeOverall, 'id' | 'createdAt' | 'updatedAt'>): Promise<ITradeOverall> {
    const dataToCreate = { ...data, author: { id: data.authorId } }
    const result = (await this.rootModel.create(dataToCreate)).toJSON();

    let tags = [] as string[];

    if (result && result.id && data.tags) {
      const tagsList = await this.tagsService.create({ tagIds: data.tags, parentId: result.id, parentType: 'note' });

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
      result.notes = await this.notesService.getByParentId(findedOne.id);
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

  async getByIds(ids: string[]): Promise<ITrade[] | undefined> {
    const result = await this.rootModel.findAll({
      where: {id: {
        [Op.in]: ids,
      },},
      raw: true
    });
    
    return result;
  }

  async deleteAllByParent(authorId: string): Promise<boolean> {
    const res = await this.rootModel.destroy({ where: { authorId } });

    return !!res;
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

  async findByIds(
    { authorId, ids }:
      Readonly<{ authorId: string, ids: string[] }>
  ): Promise<ITradeOverall[]> {
    const idsString = ids.map(id => `'${id}'`).join(',');
    const data = ids.length ? (await this.rootModel.sequelize.query(
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
        WHERE "authorId"='${authorId}' ${idsString ? `AND trade.id IN (${idsString})` : ''}
        `,
      { type: QueryTypes.SELECT }
    )) as ITradeOverall[] : [];

    return data;
  }

  async findBy(
    { pairId, limit, offset, authorId, orderBy = 'openTradeTime' }:
      Readonly<{ pairId?: string, limit?: number, offset?: number, authorId: string, orderBy: string }>
  ): Promise<Readonly<{
    data: ITradeOverall[], total: number, offset: number, limit: number, orderBy: string
  }>> {
    const [_orderBy, direction = 'DESC'] = orderBy.split(',');
    
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
        ORDER BY "${_orderBy}" ${direction}
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
      limit,
      orderBy
    }
  }
}
