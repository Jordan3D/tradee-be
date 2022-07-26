import {
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { UpdateBody } from './dto/requests';
import { CommentEntity } from 'src/models/comment.entity';
import { IComment, ICommentFull } from 'src/interfaces/comment.interface';

@Injectable()
export class CommentService {
  
  constructor(
    @InjectModel(CommentEntity) private readonly commentModel: typeof CommentEntity
  ) {}
  
  async create(data: Omit<IComment, 'id' | 'createdAt' | 'updatedAt' | 'rating'>): Promise<ICommentFull> { 
    const dataToCreate = {...data, author: {id: data.author}}
    
    return await this.commentModel.create(dataToCreate);
  }
  
  async getById(id: string, omit?: string[]): Promise<ICommentFull | undefined> {
    const findedOne = await this.commentModel.findOne({
      where: {id}
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

  async remove(id: string): Promise<boolean> {
    const res = await this.commentModel.destroy({where: {id}});
    return !!res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'parent' | 'author'>): Promise<ICommentFull | undefined> {
    try {
      await this.commentModel.update(updates, {where: {id}});
    } catch (error) {
      return error;
    }
    return this.commentModel.findOne({
      where: {id}
    });
  }
  

}
