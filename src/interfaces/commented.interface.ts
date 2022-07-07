import {IBase} from './base.interface';
import { ICommentFull } from './comment.interface';

export interface ICommentedFull extends IBase{
  comments: ICommentFull[]
}

export interface ICommented extends IBase{
  comments: string[];
}
