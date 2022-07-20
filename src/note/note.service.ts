import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBody } from './dto/requests';
import { NoteEntity } from 'src/model/note.entity';
import { INote, INoteFull } from 'src/interfaces/note.interface';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class NoteService {
  
  constructor(
    @InjectRepository(NoteEntity) private readonly rootRepo: Repository<NoteEntity>,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService
  ) {}
  
  async create(data: Omit<INote, 'id' | 'createdAt' | 'updatedAt' | 'rating'>): Promise<INoteFull> { 
    const dataToCreate = {...data, author: {id: data.author}}
    const created = this.rootRepo.create(dataToCreate);

    const result = await this.rootRepo.save(created);
    let tags = [];

    if(result && result.id){
      tags = await this.tagsService.create({tagIds: data.tags, parentId: result.id});
    }
    
    return {...result, tags};
  }
  
  async getById(id: string, omit?: string[]): Promise<INoteFull | undefined> {
    const findedOne = await this.rootRepo.findOne({
      where: {id},
      relations: ['author']
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
    const one = await this.rootRepo.findOne({where: {id}});
    const res = await this.rootRepo.remove(one);
    
    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'parent' | 'author'>): Promise<INoteFull | undefined> {
    try {
      await this.rootRepo.update(id, updates);

      if(updates.tagsAdded){
        this.tagsService.create({parentId: id, tagIds: updates.tagsAdded});
      }
      if(updates.tagsDeleted){
        this.tagsService.delete({parentId: id, tagIds: updates.tagsDeleted});
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootRepo.findOne({
      where: {id},
      relations: ['author']
    });

    return {...one, tags: await this.tagsService.getByParentId(id)}
  }
}
