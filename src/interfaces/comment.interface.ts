import {IBase} from './base.interface';
import { ICommentedFull } from './commented.interface';
import { IUser } from './user';

export interface ICommentFull extends IBase{
  content: string;
  parent: ICommentedFull;
  author: IUser;
  rating: number;
}

export interface IComment extends IBase{
  content: string;
  parent: string;
  author: string;
  rating: number;
}
