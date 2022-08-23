import {
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { PairEntity } from './pair.entity';
import { IPair } from 'src/interfaces/pair.interface';

@Injectable()
export class PairService {
  
  constructor(
    @InjectModel(PairEntity) private readonly rootModel: typeof PairEntity
  ) {}
  
  async create(data: Omit<IPair, 'id' | 'createdAt' | 'updatedAt'>): Promise<IPair> { 
    try {
      const find = await this.rootModel.findOne({where: {title: data.title}, raw: true});
      if(find){
        throw new Error('Alreay excist');
      }
    } catch(e){
      throw e;
    }
    return (await this.rootModel.create(data)).toJSON();
  }
  
  async getById(id: string, omit?: string[]): Promise<IPair | undefined> {
    const findedOne = await this.rootModel.findOne({
      where: {id},
      raw: true
    });

    const result = findedOne ? {...findedOne} : undefined;
     
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

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' >): Promise<IPair | undefined> {
    try {
      await this.rootModel.update(updates, {where: {id}});

    } catch (error) {
      return error;
    }

    const one = await this.rootModel.findOne({
      where: {id},
      raw: true
    });

    return one;
  }

  async findAll(): Promise<IPair[]> {
    return await this.rootModel.findAll();
  }
}
