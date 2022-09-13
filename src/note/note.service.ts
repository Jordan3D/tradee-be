import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { NoteEntity } from 'src/note/note.entity';
import { INote, INoteOverall } from 'src/interfaces/note.interface';
import { TagsService } from 'src/tags/tags.service';
import { Op, QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';

@Injectable()
export class NoteService {
  
  constructor(
    @InjectModel(NoteEntity) private readonly rootModel: typeof NoteEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService
  ) {}
  
  async create(data: Omit<INoteOverall, 'id' | 'createdAt' | 'updatedAt' | 'settings'>): Promise<INoteOverall> { 
    const dataToCreate = {...data, author: {id: data.authorId}}
    const result = (await this.rootModel.create(dataToCreate)).toJSON();

    let tags = [] as string[];

    if(result && result.id && data.tags){
      const tagsList = await this.tagsService.create({tagIds: data.tags, parentId: result.id, parentType: 'note'});
      tags = tagsList.map((tL : TagsEntity) => tL.tagId) || [];
    }
    
    return {...result, tags};
  }
  
  async getById(id: string, omit?: string[]): Promise<INote | undefined> {
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

  async getByIds(ids: string[]): Promise<INote[] | undefined> {
    const result = await this.rootModel.findAll({
      where: {id: {
        [Op.in]: ids,
      },},
      raw: true
    });
    
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({where: {id}});
    
    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<INoteOverall | undefined> {
    try {
      await this.rootModel.update(updates, {where: {id}});

      if(updates.tagsAdded){
        await this.tagsService.create({parentId: id, tagIds: updates.tagsAdded, parentType: 'note'});
      }
      if(updates.tagsDeleted){
        await this.tagsService.delete({parentId: id, tagIds: updates.tagsDeleted});
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: {id},
      raw: true
    });

    return {...one, tags: await this.tagsService.getByParentId(id)}
  }

  async findByDate(
    {startDate, endDate, authorId}: 
    Readonly<{startDate: string, endDate: string, authorId: string}>
    ): Promise<INote[]> {
    return await this.rootModel.findAll({where: {authorId, createdAt: {$between: [startDate, endDate]}}})
  }

  async findBy(
    {text, authorId, offset, limit, lastId}: 
    Readonly<{text?: string, authorId: string, limit?: number, offset?: number, lastId?: string}>
    ): Promise<INote[]> {
      let lastItem;
      if(lastId){
        lastItem = await this.rootModel.findOne({where: {id: lastId}, raw: true});
      }

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
        ${text ? `AND LOWER("title") LIKE LOWER('%${text}%')` : ''}
        ${lastItem ? `AND note."createdAt" < '${new Date(lastItem.createdAt).toISOString()}'` : ''}
        ORDER BY "createdAt" DESC
        ${limit ? `LIMIT ${limit}` : ''}
        ${offset ? `OFFSET ${offset}` : ''}`,
         { type: QueryTypes.SELECT }
        );
  }
}
