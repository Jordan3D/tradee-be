import {
    Injectable
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { TagEntity, TagsEntity } from '../model';
  import { Repository } from 'typeorm';
  
  @Injectable()
  export class TagsService {
    
    constructor(
      @InjectRepository(TagsEntity) private readonly rootRepo: Repository<TagsEntity>
    ) {}
    
    async create({parentId, tagIds}: Readonly<{tagIds: string[], parentId: string}>): Promise<TagsEntity[]> {
      const created = this.rootRepo.create(tagIds.map(item => ({parentId, tag: item, parentType: 'note'})));
      console.log(created);
      return await this.rootRepo.save(created);
    }
    
    async getByParentId(parentId: string): Promise<string[]> {
      const result = await this.rootRepo.find({parentId});
      
      return result ? result.map(item => (item.tag as TagEntity).id) : [];
    }
  
    async delete({parentId, tagIds}: Readonly<{tagIds: string[], parentId: string}>): Promise<boolean> {
      const result = await this.rootRepo.find({parentId});
      const res = await this.rootRepo.remove(result.filter(tag => tagIds.indexOf(tag.id) !== -1));
      
      return !!res;
    }
  }
  