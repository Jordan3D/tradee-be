import {
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateBody } from './dto/requests';
import { CommentEntity } from 'src/model/comment.entity';
import { IComment, ICommentFull } from 'src/interfaces/comment.interface';

@Injectable()
export class CommentService {
  
  constructor(
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>
  ) {}
  
  async create(data: Omit<IComment, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'rating'>): Promise<ICommentFull> { 
    const dataToCreate = {...data, author: {id: data.author}}
    const created = this.commentRepo.create(dataToCreate);
    
    return await this.commentRepo.save(created);
  }
  
  async getById(id: string, omit?: string[]): Promise<ICommentFull | undefined> {
    const findedOne = await this.commentRepo.findOne(id, {
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

  async delete(id: string): Promise<ICommentFull> {
    const one = await this.commentRepo.findOne(id);
    const res = await this.commentRepo.remove(one);
    
    return res;
  }

  async update(id: string, updates: Omit<UpdateBody, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted' | 'parent' | 'author'>): Promise<ICommentFull | undefined> {
    try {
      await this.commentRepo.update(id, updates);
    } catch (error) {
      return error;
    }
    return this.commentRepo.findOne(id, {
      relations: ['author']
    });
  }
  
  async remove(id: string): Promise<ICommentFull> {
    const one = await this.commentRepo.findOne(id);
    const res = await this.commentRepo.remove(one);
    return res;
  }
}
