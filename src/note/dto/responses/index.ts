import { IBase } from 'src/interfaces/base.interface';
import { ICommentFull } from 'src/interfaces/comment.interface';
import { INoteFull } from 'src/interfaces/note.interface';
import { IUser } from 'src/interfaces/user';
import { UserEntity } from 'src/model';

export class ResponseDto implements INoteFull {
  
  id: string;

  title: string;

  content: string;

  author: UserEntity;

  tags: string[];

  rating: number;
  
  createdAt: Date;
  
  updatedAt: Date;

  constructor(entity: INoteFull) {
    Object.keys(entity).forEach(key => {
        this[key] = entity[key];
    })
  }
}