import { IBase } from 'src/interfaces/base.interface';
import { IComment } from 'src/interfaces/comment.interface';
import { IUser } from 'src/interfaces/user';

export class ResponseDto implements IComment {
  
  id: string;

  content: string;

  authorId: string;

  parentId: string;

  parentType: 'note'|'idea';

  rating: number;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: IComment) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}