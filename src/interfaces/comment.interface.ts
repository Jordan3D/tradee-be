import { UserEntity } from 'src/model';
import { NoteEntity } from 'src/model/note.entity';
import {IBase} from './base.interface';
import { IUser } from './user';

export interface ICommentFull extends IBase{
  content: string;
  parentId: string;
  parentType: 'note' | 'idea'
  author: IUser;
  rating: number;
}

export interface IComment extends IBase{
  content: string;
  parentId: string;
  parentType: 'note' | 'idea'
  author: string;
  rating: number;
}
