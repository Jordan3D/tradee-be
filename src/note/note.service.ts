import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBody } from './dto/requests';
import { NoteEntity } from 'src/model/note.entity';
import { INote, INoteFull } from 'src/interfaces/note.interface';

@Injectable()
export class NoteService {
  
  constructor(
    @InjectRepository(NoteService) private readonly rootRepo: Repository<NoteEntity>
  ) {}
  
  async create(data: Omit<INote, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'rating'>): Promise<INoteFull> { 
    const dataToCreate = {...data, author: {id: data.author}}
    const created = this.rootRepo.create(dataToCreate);
    
    return await this.rootRepo.save(created);
  }
  
  async getById(id: string, omit?: string[]): Promise<INoteFull | undefined> {
    const findedOne = await this.rootRepo.findOne(id, {
      relations: ['author', 'children']
    });
    
    if(omit){
      omit.forEach(o => {
        if(findedOne[o] !== undefined){
          delete findedOne[o];
        }
      })
    }
    
    return findedOne;
  }

  async delete(id: string): Promise<INoteFull> {
    const one = await this.rootRepo.findOne(id);
    const res = await this.rootRepo.remove(one);
    
    return res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'parent' | 'author'>): Promise<INoteFull | undefined> {
    try {
      await this.rootRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.rootRepo.findOne(id, {
      relations: ['author']
    });
  }
  
  async remove(id: string): Promise<INoteFull> {
    const one = await this.rootRepo.findOne(id);
    const res = await this.rootRepo.remove(one);
    return res;
  }
}
