import { IBase } from 'src/interfaces/base.interface';
import { ICommentFull } from 'src/interfaces/comment.interface';
import { IUser } from 'src/interfaces/user';

export class ResponseDto implements ICommentFull {
  
  id: string;

  content: string;

  author: IUser;

  parentId: string;

  parentType: 'note'|'idea';

  rating: number;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: ICommentFull) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}