import {
  Injectable
} from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';
import { ITag } from '../interfaces/tag.interface';
import { TagEntity } from 'src/models';
import { UpdateBody } from './dto/requests';

@Injectable()
export class TagService {
  
  constructor(
    @InjectModel(TagEntity) private readonly tagModel: typeof TagEntity
  ) {}
  
  async create(data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt' | 'level'>): Promise<TagEntity> {
    const parentTag = await this.tagModel.findOne({where: {id: data.parentId}})
    const dataToCreate = {
      ...data, 
      parent: parentTag ? {id: parentTag.id} : undefined,
      author: {id: data.authorId},
      level: parentTag ? parentTag.level + 1 : 0
    };  
    
    return await this.tagModel.create(dataToCreate);
  }
  
  async getById(id: string, omit?: string[]): Promise<ITag | undefined> {
    const foundOne = await this.tagModel.findOne({
      where: {id}
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

  async getAllByAuthor(authorId: string): Promise<ITag[] | undefined> {  
    const results = await this.tagModel.findAll({
      where: {author: authorId},
      order: [['level','ASC']]
    })
    return results.map(tag => ({...tag, parent: tag?.parentId, author: tag.authorId}));
  };

  async delete(id: string): Promise<boolean> {    
    return !! await this.tagModel.destroy({where: {id}});;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' >): Promise<TagEntity | undefined> {

    const dataToUpdate = {};
    let parent = undefined;

    if(updates.parentId){
      parent = await this.tagModel.findOne({where: {id: updates.parentId}})
    }

    Object.keys(updates).forEach(key => {
      if(['parent'].includes(key)){
        dataToUpdate[key] = {id: updates[key], level: parent.level}
      } else {
        dataToUpdate[key] = updates[key];
      }
    })

    try {
      await this.tagModel.update(dataToUpdate, {where: {id}});
    } catch (error) {
      return error;
    }
    return this.tagModel.findOne({
      where: {id}
    });
  }
  
  async remove(id: string): Promise<boolean> {
    const res = await this.tagModel.destroy({where: {id}});
    return !!res;
  }
}
