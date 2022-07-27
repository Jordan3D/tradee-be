import {IBase} from './base.interface';
import { IUser } from './user';

export interface IComment extends IBase{
  content: string;
  parentId: string;
  parentType: 'note' | 'idea'
  authorId: string;
  rating: number;
}
