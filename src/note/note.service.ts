import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { NoteEntity } from 'src/models/note.entity';
import { INote } from 'src/interfaces/note.interface';
import { TagsService } from 'src/tags/tags.service';

@Injectable()
export class NoteService {
  
  constructor(
    @InjectModel(NoteEntity) private readonly rootModel: typeof NoteEntity,
    @Inject(forwardRef(() => TagsService))
    private readonly tagsService: TagsService
  ) {}
  
  async create(data: Omit<INote, 'id' | 'createdAt' | 'updatedAt' | 'rating'>): Promise<INote> { 
    const dataToCreate = {...data, author: {id: data.authorId}}
    const result = await this.rootModel.create(dataToCreate);

    let tags = [];

    if(result && result.id){
      tags = await this.tagsService.create({tagIds: data.tags, parentId: result.id});
    }
    
    return {...result, tags};
  }
  
  async getById(id: string, omit?: string[]): Promise<INote | undefined> {
    const findedOne = await this.rootModel.findOne({
      where: {id}
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

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'parent' | 'author'>): Promise<INote | undefined> {
    try {
      await this.rootModel.update(updates, {where: {id}});

      if(updates.tagsAdded){
        this.tagsService.create({parentId: id, tagIds: updates.tagsAdded});
      }
      if(updates.tagsDeleted){
        this.tagsService.delete({parentId: id, tagIds: updates.tagsDeleted});
      }
    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: {id}
    });

    return {...one, tags: await this.tagsService.getByParentId(id)}
  }
}
