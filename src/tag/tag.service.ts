import {
  Injectable
} from '@nestjs/common';
import { InjectModel} from '@nestjs/sequelize';
import { ITag } from '../interfaces/tag.interface';
import { TagEntity } from 'src/models';
import { UpdateBody } from './dto/requests';
import { Op } from 'sequelize';

@Injectable()
export class TagService {
  
  constructor(
    @InjectModel(TagEntity) private readonly rootModel: typeof TagEntity
  ) {}
  
  async create(data: Omit<ITag, 'id' | 'createdAt' | 'updatedAt' | 'level'>): Promise<TagEntity> {
    const parentTag = await this.rootModel.findOne({where: {id: data.parentId}, raw: true})
    const dataToCreate = {
      ...data, 
      level: parentTag ? parentTag.level + 1 : 0
    };

    const tag = new TagEntity(dataToCreate);
    await tag.save();

    return tag.toJSON();
  }
  
  async getById(id: string, omit?: string[]): Promise<ITag | undefined> {
    const foundOne = await this.rootModel.findOne({
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

  async getByIds(ids: string[]): Promise<ITag[] | undefined> {
    const result = await this.rootModel.findAll({
      where: {id: {
        [Op.in]: ids,
      },},
      raw: true
    });
    
    return result;
  }

  async getAllBy(authorId: string, text: string = ''): Promise<ITag[] | undefined> {  
    return await this.rootModel.findAll({
      where: {authorId, title: {
        [Op.iLike]: `%${text.toLowerCase()}%`,
      }},
      order: [['level','ASC']]
    })
  };

  async delete(id: string): Promise<boolean> {    
    return !! await this.rootModel.destroy({where: {id}});
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' >): Promise<TagEntity | undefined> {

    const dataToUpdate = {} as ITag;
    let parent = undefined;

    if(updates.parentId){
      parent = await this.rootModel.findOne({where: {id: updates.parentId}, raw: true})
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
      await this.rootModel.update(dataToUpdate, {where: {id}});
    } catch (error) {
      return error;
    }
    return this.rootModel.findOne({
      where: {id},
      raw: true
    });
  }
  
  async remove(id: string): Promise<boolean> {
    const res = await this.rootModel.destroy({where: {id}});
    return !!res;
  }
}
