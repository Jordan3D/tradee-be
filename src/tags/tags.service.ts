import {
    Injectable
  } from '@nestjs/common';
  import { InjectModel } from '@nestjs/sequelize';
  import { TagEntity, TagsEntity } from 'src/models';
  
  @Injectable()
  export class TagsService {
    
    constructor(
      @InjectModel(TagsEntity) private readonly rootModel: typeof TagsEntity
    ) {}
    
    async create(
      {parentId, tagIds, parentType}: 
      Readonly<{tagIds: string[], parentId: string, parentType: 'note' | 'idea' | 'trade'}>): Promise<TagsEntity[]> {
      const result =  await this.rootModel.bulkCreate(tagIds.map(item => ({parentId, tagId: item, parentType})));
      return result.map(item => item.toJSON())
    }
    
    async getByParentId(parentId: string): Promise<string[]> {
      const result = await this.rootModel.findAll({where: {parentId}, raw: true});
      
      return result ? result.map(item => item.tagId) : [];
    }
  
    async delete({parentId, tagIds}: Readonly<{tagIds: string[], parentId: string}>): Promise<boolean> {
      const res = await this.rootModel.destroy({where: {parentId, tagId: tagIds}});
      
      return !!res;
    }
  }
  