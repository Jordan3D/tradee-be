import {
    Injectable
  } from '@nestjs/common';
  import { InjectRepository } from '@nestjs/typeorm';
  import { TagsEntity } from '../model';
  import { Repository } from 'typeorm';
  
  @Injectable()
  export class TagsService {
    
    constructor(
      @InjectRepository(TagsEntity) private readonly rootRepo: Repository<TagsEntity>
    ) {}
    
    async create(data: Readonly<{tagIds: string[], parentId: string}>): Promise<TagsEntity[]> {
      const created = this.rootRepo.create(data.tagIds.map(item => ({parentId: data.parentId, tagId: item})));
      
      return await this.rootRepo.save(created);
    }
    
    async getByParentId(parentId: string): Promise<string[] | undefined> {
      const result = await this.rootRepo.find({parentId});
      
      return result.map(item => item.tagId);
    }
  
    async delete(parentId: string, tagId: string): Promise<boolean> {
      const one = await this.rootRepo.findOne({parentId, tagId});
      const res = await this.rootRepo.remove(one);
      
      return !!res;
    }
  }
  