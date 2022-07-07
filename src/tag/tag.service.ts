import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ITag, ITagFull } from '../interfaces/tag.interface';
import { TagEntity } from '../model';
import { Repository } from 'typeorm';
import { UsersService } from 'src/user';
import { UpdateBody } from './dto/requests';

@Injectable()
export class TagService {
  
  constructor(
    @InjectRepository(TagEntity) private readonly tagRepo: Repository<TagEntity>,
    @Inject(forwardRef(() => UsersService))
    private readonly userService: UsersService,
  ) {}
  
  async create(data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<TagEntity> {
    const dataToCreate = {
      ...data, 
      parent: data.parent ? {id: data.parent} : undefined,
      owner: data.owner ? {id: data.owner} : undefined
    };  
    const tag = this.tagRepo.create(dataToCreate);
    
    return await this.tagRepo.save(tag);
  }
  
  async getById(id: string, omit?: string[]): Promise<ITagFull | undefined> {
    const tag = await this.tagRepo.findOne(id, {
      relations: ['parent', 'owner', 'children']
    });
    
    if(omit){
      omit.forEach(o => {
        if(tag[o] !== undefined){
          delete tag[o];
        }
      })
    }
    
    return tag;
  }

  async delete(id: string): Promise<TagEntity> {
    const one = await this.tagRepo.findOne(id);
    const res = await this.tagRepo.remove(one);
    
    return res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>): Promise<TagEntity | undefined> {

    const dataToUpdate = {};

    Object.keys(updates).forEach(key => {
      if(['parent', 'owner'].includes(key)){
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
      relations: ['parent', 'owner', 'children']
    });
  }
  
  async remove(id: string): Promise<TagEntity> {
    const one = await this.tagRepo.findOne(id);
    const res = await this.tagRepo.remove(one);
    return res;
  }
}
