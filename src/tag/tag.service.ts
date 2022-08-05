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
    const parentTag = await this.tagModel.findOne({where: {id: data.parentId}, raw: true})
    const dataToCreate = {
      ...data, 
      level: parentTag ? parentTag.level + 1 : 0
    };

    const tag = new TagEntity(dataToCreate);
    await tag.save();

    return tag.toJSON();
  }
  
  async getById(id: string, omit?: string[]): Promise<ITag | undefined> {
    const foundOne = await this.tagModel.findOne({
      where: {id},
      raw: true
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
    return await this.tagModel.findAll({
      where: {authorId},
      order: [['level','ASC']]
    })
  };

  async delete(id: string): Promise<boolean> {    
    return !! await this.tagModel.destroy({where: {id}});;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' >): Promise<TagEntity | undefined> {

    const dataToUpdate = {} as ITag;
    let parent = undefined;

    if(updates.parentId){
      parent = await this.tagModel.findOne({where: {id: updates.parentId}, raw: true})
    }

    Object.keys(updates).forEach(key => {
      if(key === 'parentId'){
        dataToUpdate[key] = updates[key],
        dataToUpdate.level = parent.level + 1;
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
      where: {id},
      raw: true
    });
  }
  
  async remove(id: string): Promise<boolean> {
    const res = await this.tagModel.destroy({where: {id}});
    return !!res;
  }
}
