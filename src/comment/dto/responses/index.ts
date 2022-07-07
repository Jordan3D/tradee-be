import { IBase } from 'src/interfaces/base.interface';
import { ICommentFull } from 'src/interfaces/comment.interface';
import { ICommentedFull } from 'src/interfaces/commented.interface';
import { IUser } from 'src/interfaces/user';

export class ResponseDto implements ICommentFull {
  
  id: string;

  content: string;

  author: IUser;

  parent: ICommentedFull;

  rating: number;

  isDeleted: boolean;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: ICommentFull) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}