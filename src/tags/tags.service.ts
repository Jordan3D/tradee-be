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
    
    async create({parentId, tagIds}: Readonly<{tagIds: string[], parentId: string}>): Promise<TagsEntity[]> {
      return await this.rootModel.bulkCreate(tagIds.map(item => ({parentId, tag: item, parentType: 'note'})));
    }
    
    async getByParentId(parentId: string): Promise<string[]> {
      const result = await this.rootModel.findAll({where: {parentId}});
      
      return result ? result.map(item => item.tagId) : [];
    }
  
    async delete({parentId, tagIds}: Readonly<{tagIds: string[], parentId: string}>): Promise<boolean> {
      const res = await this.rootModel.destroy({where: {parentId, tag: tagIds}});
      
      return !!res;
    }
  }
  