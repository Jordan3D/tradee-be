import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { IdeaEntity } from 'src/idea/idea.entity';
import { IIdea, IIdeaOverall } from 'src/interfaces/idea.interface';
import { TagsService } from 'src/tags/tags.service';
import { Op, QueryTypes } from 'sequelize';
import { TagsEntity } from 'src/models';

@Injectable()
export class IdeaService {
  
  constructor(
    @InjectModel(IdeaEntity) private readonly rootModel: typeof IdeaEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService
  ) {}
  
  async create(data: Omit<IIdeaOverall, 'id' | 'createdAt' | 'updatedAt' | 'settings'>): Promise<IIdeaOverall> { 
    const dataToCreate = {...data, author: {id: data.authorId}}
    const result = (await this.rootModel.create(dataToCreate)).toJSON();

    let tags = [] as string[];

    if(result && result.id && data.tags){
      const tagsList = await this.tagsService.create({tagIds: data.tags, parentId: result.id, parentType: 'idea'});
      console.log(tagsList)
      tags = tagsList.map((tL : TagsEntity) => tL.tagId) || [];
    }
    
    return {...result, tags};
  }
  
  async getById(id: string, omit?: string[]): Promise<IIdea | undefined> {
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

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'author'>): Promise<IIdeaOverall | undefined> {
    try {
      await this.rootModel.update(updates, {where: {id}});

      if(updates.tagsAdded){
        await this.tagsService.create({parentId: id, tagIds: updates.tagsAdded, parentType: 'idea'});
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
    ): Promise<IIdea[]> {
    return await this.rootModel.findAll({where: {authorId, createdAt: {$between: [startDate, endDate]}}})
  }

  async findBy(
    {text, authorId, lastId, limit}: 
    Readonly<{text?: string, authorId: string, limit?: number, lastId?: string}>
    ): Promise<IIdea[]> {
      const id = lastId ? {$gt: lastId} : {};
      return await this.rootModel.sequelize.query(
        `SELECT *  FROM "Idea" idea,
        LATERAL (
           SELECT ARRAY (
              SELECT "tagId"
              FROM   "Tags" tags
              WHERE  tags."parentId" = idea.id
              ) AS tags
           ) t
        WHERE "authorId"='${authorId}'
        ORDER BY "createdAt" ASC`,
         { type: QueryTypes.SELECT }
        );
  }
}
