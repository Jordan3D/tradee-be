import {
  Injectable
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITag, ITagFull } from '../interfaces/tag.interface';
import { TagEntity } from '../model';
import { Repository } from 'typeorm';
import { UpdateBody } from './dto/requests';

@Injectable()
export class TagService {
  
  constructor(
    @InjectRepository(TagEntity) private readonly tagRepo: Repository<TagEntity>
  ) {}
  
  async create(data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt' >): Promise<TagEntity> {
    const dataToCreate = {
      ...data, 
      parent: data.parent ? {id: data.parent} : undefined,
      author: {id: data.author}
    };  
    const created = this.tagRepo.create(dataToCreate);
    
    return await this.tagRepo.save(created);
  }
  
  async getById(id: string, omit?: string[]): Promise<ITagFull | undefined> {
    const foundOne = await this.tagRepo.findOne(id, {
      relations: ['parent', 'author', 'children']
    });
    
    if(omit){
      omit.forEach(o => {
        if(foundOne[o] !== undefined){
          delete foundOne[o];
        }
      })
    }
    
    return foundOne;
  }

  async delete(id: string): Promise<TagEntity> {
    const one = await this.tagRepo.findOne(id);
    const res = await this.tagRepo.remove(one);
    
    return res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' >): Promise<TagEntity | undefined> {

    const dataToUpdate = {};

    Object.keys(updates).forEach(key => {
      if(['parent'].includes(key)){
        dataToUpdate[key] = {id: updates[key]}
      } else {
        dataToUpdate[key] = updates[key];
      }
    })

    try {
      await this.tagRepo.update(id, dataToUpdate);
    } catch (error) {
      return error;
    }
    return this.tagRepo.findOne(id, {
      relations: ['parent', 'author', 'children']
    });
  }
  
  async remove(id: string): Promise<boolean> {
    const one = await this.tagRepo.findOne(id);
    const res = await this.tagRepo.remove(one);
    return !!res;
  }
}
